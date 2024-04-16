package git

type Datasource struct {
	// URL is the URL of the Git repository
	URL string
	// Ref is the Git reference to use
	Ref string
}
