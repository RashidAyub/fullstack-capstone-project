CURL COMMAND: curl -X POST http://localhost:3060/api/auth/login -H "Content-Type: application/json" -d '{"email":"tester_final@example.com","password":"Password123!"}'

OUTPUT: {"authtoken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNmFhYWU5ZmM1NDdhNDdlNjdjMDQ0NjNkIiwiZW1haWwiOiJ0ZXN0ZXJfZmluYWxAZXhhbXBsZS5jb20ifSwiaWF0IjoxNzg5NTg1OTU3LCJleHAiOjE3OTAxOTA3NTd9.ON_72Rj2yNKCeXsykwoy-8k4qOxecrZ3xyUYJ77_KrA","userName":"Test","userEmail":"tester_final@example.com"}
