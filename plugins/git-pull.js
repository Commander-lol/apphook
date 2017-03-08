const child = require('child_process')

module.exports = ({path, remote = 'origin', branch = 'master'}, hook) => new Promise((r, re) => {
	child.exec(
		'git reset --hard HEAD',
		{
			cwd: path
		},
		e => e ? re(e) : child.exec(
			`git checkout ${remote}/${branch} && git pull ${remote} ${branch}`,
			{
				cwd: path
			},
			eo => eo ? re(eo) : r(true)
		)
	)
})
