@echo off
echo === Root Health Check ===
curl http://localhost:5500/
echo.

echo === Register Recruiter ===
curl -X POST http://localhost:5500/api/recruiters/register -H "Content-Type: application/json" -d "{\"name\":\"Test Recruiter\",\"email\":\"test@company.com\",\"phone\":\"9876543210\",\"company\":\"TestCorp\"}"
echo.

echo === Superadmin Recruiter Data ===
curl "http://localhost:5500/api/superadmin/recruiters?email=1angshuman.biswas@gmail.com"
echo.

echo === Upload Candidate CV ===
curl -X POST http://localhost:5500/api/candidates/upload-cv -F "name=John Doe" -F "email=john@example.com" -F "cv=@\"C:/Users/angsh/OneDrive/Desktop/sample.pdf\""
echo.

echo === List Candidates ===
curl http://localhost:5500/candidates
echo.

echo === Track Recruiter Visit ===
curl -X POST http://localhost:5500/api/recruiters/track-visit -H "Content-Type: application/json" -d "{\"recruiterEmail\":\"test@company.com\",\"company\":\"TestCorp\"}"
echo.

echo === Recruiter Visit Analytics ===
curl "http://localhost:5500/api/recruiters/visits?period=week"
echo.

echo === All tests complete ===
pause