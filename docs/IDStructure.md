# ID Structure

## Content

|            | Principe                          | Example | Max. value |
| ---------- | --------------------------------- | ------- | ---------- |
| Module     | Three uppercase letters [A-Z]     | MIO     | —          |
| Lesson     | Two digits, starts with 01 [0-9]  | 01      | 99         |
| Task       | Two digits, starts with 01 [0-9]  | 01      | 99         |
| Content    | Two digits, starts with 01 [0-9]  | 01      | 99         |
| Question   | Two digits, starts with 01 [0-9]  | 01      | 99         |
| Answer     | Two digits, starts with 01 [0-9]  | 01      | 99         |
| Other data | Four digits, starts with 01 [0-9] | 0001    | 0099       |

_Notice: if content (text, img, etc.) used in top level of data (for example, module intro), it contain ID of this level equal 00._

### Examples

- Second lesson of module — XXX02
- Sixteen task of second lesson — XXX0216
- Third answer of previous task first question — XXX0216010103
- Some image in second block’s intro — XXX0216020012
- Text block ID for module intro — XXX0000000008

<aside>
📣 These combinations of unique IDs is using for API requests and for cross-linking with different items. They are using always in a full form. The exception: lesson ID in a list inside the module info.

</aside>

## User

Prefix “U” and seven digits. Example: U0000001

### Certificate

|               | Principe                            | Example | Max. value |
| ------------- | ----------------------------------- | ------- | ---------- |
| ModuleId      | Three uppercase letters [A-Z]       | MIO     | —          |
| Start year    | Two digits, starts with 01 [0-9]    | 01      | 99         |
| Start month   | Two digits, starts with 01 [0-9]    | 01      | 12         |
| CertificateId | Four digits, starts with 0001 [0-9] | 0001    | 9999       |

Example: XXX23041234

<aside>
📣 The four-digit number of certificate will orderly generate in first request to this diploma.

</aside>
