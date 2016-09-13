# apphook
Simple Github Deploy Server

### Wut?
Sometimes you need to do things on your server when other people do other things on Github. This lets you do that.

Real documentation coming soon

### How To
So you want some apphooks? It's pretty simple;

1. Clone this repository to your server - `git clone https://github.com/Commander-lol/apphook`
2. Make a copy of `config.example.json` called `config.json`
3. Create a file in `/hooks` that exports some JSON that describes what you're doing. The only hard and fast requirement 
is an array keyed by `hooks` - this specifies what plugins to run when this hook gets fired. Any top level strings can 
also include environment variables by surrounding them with `%`s (e.g. `$HOME` would be `%HOME%`...it's a 
[lineup](https://github.com/Commander-lol/lineup) template)
4. Write some plugins in the `/plugins` folder to do stuff. A plugin should export a function that takes as its parameters
the configuration file that triggered it (so set up some other properties in that config file, silly!) and the github
webhook payload. It should **ALWAYS** return a promise. Coming soon will be a facility to wrap non-promise returns 
from those silly people that don't like playing nicely with the other kids
5. Do your funky thing to run a node app on your server (`npm start` or `node apphook`). It's different for everyone, 
it's all good.
6. On your github repo, add a webhook (`Settings` > `Webhooks & services` > `Add Webhook`) where the url is 
`http(s)://my.domain.com/{hook}` where `{hook}` is the name of the file you created in `/hooks` 
(without the extension - just make sure it's something your node engine can `require`)
7. Do some stuff with your repo
8. Party!

### Examples
There isn't currently an example hook config, but there is an example plugin.

`git-pull` resets and then pulls the git repo in the specified path. In the config you need to specify the `path` to
the folder containing the repo, and optionally a `remote` and `branch` to reset, checkout and pull

### Licensing
This code is covered under the BSD-3-Clause license, but if that doesn't work with your flow then contact me and we
can probably work something out
