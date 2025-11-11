-- CreateTable
CREATE TABLE "public"."likes" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "activity_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "likes_owner_id_activity_id_key" ON "public"."likes"("owner_id", "activity_id");

-- AddForeignKey
ALTER TABLE "public"."likes" ADD CONSTRAINT "likes_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
