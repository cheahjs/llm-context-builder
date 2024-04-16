package datasources

type Datasource interface {
	// Get returns a map of key-value pairs representing the data
	// Example would be a map of path to contents of a Git repository
	Get() (map[string]string, error)
}
