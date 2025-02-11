# syntax = docker/dockerfile:1

ARG RUBY_VERSION=3.3.4
FROM registry.docker.com/library/ruby:$RUBY_VERSION-slim as base

# Rails app lives here
WORKDIR /rails

# Set production environment
ENV RAILS_ENV="production" \
    BUNDLE_DEPLOYMENT="1" \
    BUNDLE_PATH="/usr/local/bundle"

# Add these lines to keep environment variables
ARG OPENAI_API_KEY
ENV OPENAI_API_KEY=$OPENAI_API_KEY
ARG FIREBASE_PROJECT_ID
ENV FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID
ARG FIREBASE_CLIENT_EMAIL
ENV FIREBASE_CLIENT_EMAIL=$FIREBASE_CLIENT_EMAIL
ARG FIREBASE_ADMIN_SDK_CREDENTIALS
ENV FIREBASE_ADMIN_SDK_CREDENTIALS=$FIREBASE_ADMIN_SDK_CREDENTIALS

# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build gems and Node.js
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential git libpq-dev libvips pkg-config \
    curl gnupg2

# Install Node.js 20.x
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g yarn

# Install application gems
COPY Gemfile Gemfile.lock ./
RUN bundle config set --local frozen 'false' && \
    bundle install && \
    rm -rf ~/.bundle/ "${BUNDLE_PATH}"/ruby/*/cache "${BUNDLE_PATH}"/ruby/*/bundler/gems/*/.git

# Install Firebase CLI
RUN npm install -g firebase-tools

# Copy application code
COPY . .

# Precompile bootsnap code for faster boot times
RUN bundle exec bootsnap precompile app/ lib/

# Final stage for app image
FROM base

# Install packages needed for deployment
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y curl libvips postgresql-client && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Install Node.js 20.x
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g yarn

# Install Firebase CLI
RUN npm install -g firebase-tools

# Copy built artifacts: gems, application
COPY --from=build /usr/local/bundle /usr/local/bundle
COPY --from=build /rails /rails

# Run and own only the runtime files as a non-root user for security
RUN useradd rails --create-home --shell /bin/bash && \
    chown -R rails:rails db log storage tmp
USER rails:rails

# Entrypoint prepares the database.
ENTRYPOINT ["/rails/bin/docker-entrypoint"]

# Start the server by default, this can be overwritten at runtime
EXPOSE 3001
CMD ["./bin/rails", "server"]