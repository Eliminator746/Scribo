-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'system';

-- CreateIndex
CREATE INDEX "Post_slug_idx" ON "Post"("slug");
