# apphook
Simple Github Deploy Server

### Wut?
Sometimes you need to do things on your server when other people do other things on Github. This lets you do that.

For more easily navigable docs, check out [the docs](https://apphook.co.uk)

### How To
So you want some apphooks? It's pretty simple;

1. Clone this repository to your server - `git clone https://github.com/Commander-lol/apphook`
2. Make a copy of `.env.example` called `.env`
3. Create a file in `/hooks` that [exports some JSON](https://apphook.co.uk#hook-format) that describes what you're doing. The only hard and fast requirement 
is an array keyed by `hooks` - this specifies what plugins to run when this hook gets fired. Any top level strings can 
also include environment variables by surrounding them with `%`s (e.g. `$HOME` would be `%HOME%`...it's a 
[lineup](https://github.com/Commander-lol/lineup) template). This includes values defined in the `.env` file
4. Write some plugins in the `/plugins` folder to do stuff. A plugin should export a function that takes as its parameters
the configuration file that triggered it (so set up some other properties in that config file, silly!) and the github
webhook payload. It should **ALWAYS** return a promise. If you're using node 7.6.0+, this means you can
return an `async` function and it'll be handled fine. 
5. Do your funky thing to run a node app on your server (`npm start` or `node apphook`). It's different for everyone, 
it's all good.
6. On your github repo, add a webhook (`Settings` > `Webhooks & services` > `Add Webhook`) where the url is 
`http(s)://my.domain.com/{hook}` and where `{hook}` is the name of the file you created in `/hooks` 
(without the extension - just make sure it's something your node engine can `require`). You can use paths with
multiple segments - how apphook handles that is configured in the `.env` file
7. Do some stuff with your repo
8. Party!

### Plugins

See "[Writing a Plugin](https://apphook.co.uk#writing-a-plugin)"

Plugins can be written either locally (and placed within the `plugins` folder) or as an npm package.
In order for apphook to discover an npm plugin, it should be named `apphook-recipe-{plugin}`. You
can then refer to this in your hook configs by simply using `{plugin}` as the plugin identifier.

### Licensing
This code is covered under the BSD-3-Clause license, but if that doesn't work with your flow then contact me and we
can probably work something out
