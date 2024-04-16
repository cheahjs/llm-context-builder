package naive_fallback

// TokenCounter is a naive implementation of the TokenCounter interface
// It returns the number of tokens in the data by dividing the length of the data by 4
// This is a rough approximation based on OpenAI's rule of thumb for English text
type TokenCounter struct{}

func (tc TokenCounter) Count(data string) (int, error) {
	return len(data) / 4, nil
}
