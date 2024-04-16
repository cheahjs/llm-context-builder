package tiktoken

import (
	"github.com/cockroachdb/errors"
	"github.com/pkoukk/tiktoken-go"
)

// TokenCounter is an interface for counting tokens in data using tiktoken for tokenization
type TokenCounter struct {
	// Encoding is the encoding to use for tokenization. Defaults to cl100k_base
	Encoding string
}

// Count returns the number of tokens in the data
func (tc TokenCounter) Count(data string) (int, error) {
	encoding := tc.Encoding
	if tc.Encoding == "" {
		encoding = "cl100k_base"
	}
	tke, err := tiktoken.GetEncoding(encoding)
	if err != nil {
		return 0, errors.Wrapf(err, "failed to get encoding: %v", encoding)
	}
	tokens := tke.Encode(data, nil, nil)
	return len(tokens), nil
}
