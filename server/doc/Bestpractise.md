In posts.serializer

One serializer is doing too many jobs

Your BlogSerializer is being used for:

list
detail
maybe create/update

That works early on, but does not scale well.

Industry pattern is:

Use case Serializer
List blogs lightweight
Blog detail full
Create/update write-only

---
