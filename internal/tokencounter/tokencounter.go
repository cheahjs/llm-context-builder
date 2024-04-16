package tokencounter

// TokenCounter is an interface for counting tokens in data
// Implementations should be able to count the number of tokens in the data
type TokenCounter interface {
	// Count returns the number of tokens in the data
	Count(data string) (int, error)
}
