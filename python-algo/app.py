from fastapi import FastAPI

# Step 1: Create a FastAPI app instance
app = FastAPI()


# Step 2: Create a route (endpoint)
# @app.get("/") means: when someone visits the root URL with a GET request
@app.get("/")
def hello_world():
    return {"message": "Hello World"}


# Step 3: Create another route
@app.get("/greet/{name}")
def greet_user(name: str):
    return {"message": f"Hello, {name}!"}


# Step 4: Run the server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
