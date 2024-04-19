package git

type Datasource struct {
	// Path is the path to a directory containing files
	Path string
	// GlobPatterns is a list of glob patterns to match files if specified. If not specified, all files are matched.
	//
	GlobPatterns []string
	// RespectGitIgnore specifies whether to respect .gitignore files. Defaults to true.
	RespectGitIgnore bool
}

func (d *Datasource) Get() (map[string]string, error) {

	return nil, nil
}
