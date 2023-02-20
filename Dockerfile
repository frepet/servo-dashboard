# https://www.reddit.com/r/sveltejs/comments/tbu8sy/tutorial_how_to_build_a_sveltekit_docker_image_to/
FROM node:16.17 as build

# install dependencies
WORKDIR /app

# Copy all local files into the image.
COPY . .

# clean install all dependencies
RUN npm ci

# remove potential security issues
RUN npm audit fix

RUN npm run build

###
# Only copy over the Node pieces we need
# ~> Saves 35MB
###
FROM node:16.17

WORKDIR /app

COPY --from=build /app/package*.json ./

# clean install dependencies, no devDependencies, no prepare script
RUN npm ci --production --ignore-scripts

# remove potential security issues
RUN npm audit fix

# copy built SvelteKit app to /app
COPY --from=build /app/build ./

EXPOSE 3000
CMD ["node", "./index.js"]