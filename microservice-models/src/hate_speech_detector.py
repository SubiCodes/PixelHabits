import pickle
import re
import os
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer

class HateSpeechDetector:
    def __init__(self):
        """Initialize the hate speech detector by loading the model and vectorizer"""
        base_dir = os.path.dirname(__file__)
        model_path = os.path.join(base_dir, 'hate_speech_model.pkl')
        vectorizer_path = os.path.join(base_dir, 'tfidf_vectorizer.pkl')
        
        # Load model and vectorizer
        with open(model_path, 'rb') as f:
            self.model = pickle.load(f)
        
        with open(vectorizer_path, 'rb') as f:
            self.vectorizer = pickle.load(f)
        
        # Initialize NLTK components
        self.lemmatizer = WordNetLemmatizer()
        self.stop_words = set(stopwords.words('english'))
        
        # Class mapping
        self.class_names = {
            0: 'hate_speech',
            1: 'offensive_language',
            2: 'neither'
        }
    
    def preprocess_text(self, text):
        """Clean and preprocess text"""
        # Convert to lowercase
        text = text.lower()
        
        # Remove URLs
        text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
        
        # Remove user mentions and hashtags
        text = re.sub(r'@\w+|#\w+', '', text)
        
        # Remove special characters and numbers
        text = re.sub(r'[^a-zA-Z\s]', '', text)
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        # Tokenization
        tokens = word_tokenize(text)
        
        # Remove stopwords and lemmatize
        tokens = [self.lemmatizer.lemmatize(word) for word in tokens if word not in self.stop_words]
        
        return ' '.join(tokens)
    
    def predict(self, text):
        """
        Predict if text contains hate speech, offensive language, or neither
        
        Returns:
        {
            'text': original text,
            'classification': 'hate_speech' | 'offensive_language' | 'neither',
            'confidence': probability score
        }
        """
        # Preprocess
        cleaned_text = self.preprocess_text(text)
        
        # Vectorize
        vectorized = self.vectorizer.transform([cleaned_text])
        
        # Predict
        prediction = self.model.predict(vectorized)[0]
        probabilities = self.model.predict_proba(vectorized)[0]
        confidence = float(max(probabilities))
        
        return {
            'text': text,
            'classification': self.class_names[prediction],
            'confidence': confidence
        }
    
    def is_harmful(self, text):
        """
        Check if text is harmful (hate speech or offensive language)
        
        Returns: boolean
        """
        result = self.predict(text)
        return result['classification'] in ['hate_speech', 'offensive_language']