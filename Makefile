setup:
	bash -c "cd backend && npm install"
	bash -c "cd frontend && npm install"

run_backend:
	bash -c "cd backend && docker compose up -d mongo && npm run dev"

run_frontend:
	bash -c "cd frontend && npm start"

run_docker:
	bash -c "cd backend && docker compose up -d" & \
	bash -c "cd frontend && npm start"
