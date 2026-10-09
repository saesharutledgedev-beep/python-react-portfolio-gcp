# Base image: official Python 3.12 build on a minimal Debian ("slim").
# Smaller than the default python:3.12 image (no compilers, docs, etc.),
# which means faster pulls/builds and a smaller attack surface.
# Pulled via mirror.gcr.io (Google's public Docker Hub mirror) instead of
# docker.io directly -- GitHub-hosted runners share IPs across countless
# workflows, which hits Docker Hub's anonymous-pull rate limit (429 Too
# Many Requests) often enough to break builds unpredictably. Same image,
# same tag, just a different unrate-limited source.
FROM mirror.gcr.io/library/python:3.12-slim

# All following instructions (COPY, RUN, CMD) run relative to /app inside
# the container. Docker creates this directory if it doesn't exist.
WORKDIR /app

# Copy ONLY the dependency manifest first, not the whole app yet.
# Docker caches each layer keyed on its inputs. As long as requirements.txt
# doesn't change, this layer (and the pip install below) is reused from
# cache on rebuilds, even if you've edited app.py -- much faster iteration.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Now copy the rest of the source (app.py, routes/, etc.). This layer
# invalidates on almost every code change, which is fine since it's cheap --
# it's just a file copy, no reinstall.
COPY . .

# Create a non-root user and switch to it. By default a container runs as
# root, which is unnecessary risk: if the app were ever compromised, root
# inside the container has more reach (e.g. writing anywhere in the
# container filesystem) than a dedicated unprivileged user would.
RUN useradd --create-home appuser
USER appuser

# Documents which port the container listens on. This is metadata only --
# it doesn't actually publish the port. You still need `-p 8080:8080` on
# `docker run`, or a `ports:` entry in docker-compose.yml / a k8s Service.
EXPOSE 8080

# The command that runs when the container starts. gunicorn is a
# production-grade WSGI server (Flask's own `app.run()` dev server isn't
# meant to be used in production). Breaking down the args:
#   --bind 0.0.0.0:8080  listen on all interfaces inside the container, not
#                         just localhost -- otherwise it's unreachable from
#                         outside the container.
#   --workers 2           run 2 worker processes to handle requests
#                         concurrently.
#   app:app                <module>:<Flask instance name> -- i.e. the
#                         variable named `app` inside app.py.
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "--workers", "2", "app:app"]
