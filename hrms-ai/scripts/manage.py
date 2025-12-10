# manage.py

import sys

def main():
    command = sys.argv[1] if len(sys.argv) > 1 else None

    if command == "runserver":
        run_server()
    elif command == "migrate":
        run_migrations()
    else:
        print("Unknown command. Available commands: runserver, migrate")

def run_server():
    print("Starting the server...")

def run_migrations():
    print("Running migrations...")

if __name__ == "__main__":
    main()