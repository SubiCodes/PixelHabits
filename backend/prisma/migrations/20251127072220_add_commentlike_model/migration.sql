-- CreateTable
CREATE TABLE "commentLikes" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "comment_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "commentLikes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "commentLikes_owner_id_comment_id_key" ON "commentLikes"("owner_id", "comment_id");

-- AddForeignKey
ALTER TABLE "commentLikes" ADD CONSTRAINT "commentLikes_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
