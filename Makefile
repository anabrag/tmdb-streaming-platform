setup:
	bash -c "cd backend && npm install"
	bash -c "cd frontend && npm install"

run:
	bash -c "cd backend && npm run dev" & \
	bash -c "cd frontend && npm start"

run_docker:
	bash -c "cd backend && docker compose up" & \
	bash -c "cd frontend && npm start"
