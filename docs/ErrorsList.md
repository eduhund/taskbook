# Error codes and descriptions

| Code  | Type                | Description                           |
| ----- | ------------------- | ------------------------------------- |
| 10001 | invalid_request     | Invalid path                          |
| 10002 | invalid_request     | Missing required params               |
| 10003 | invalid_request     | Param is invalid                      |
| 10101 | invalid_credentials | User didn't found                     |
| 10102 | invalid_credentials | Invalid password                      |
| 10103 | invalid_credentials | Access token is invalid or expired    |
| 10104 | invalid_credentials | Invalid refresh token                 |
| 10105 | invalid_credentials | Verify key is invalid or expired      |
| 10106 | invalid_credentials | Payment didn't found                  |
| 10201 | access_denied       | You don't have access to this content |
| 10202 | access_denied       | You don't have access to add comments |
| 10301 | miss_content        | Module didn't found                   |
| 10302 | miss_content        | Lesson didn't found                   |
| 10303 | miss_content        | Task didn't found                     |
| 20101 | validate_failure    | Error request params validate         |
| 20201 | process_failure     | Error in auth user process            |
| 20202 | process_failure     | Error in create pass process          |
| 20203 | process_failure     | Error in check payment process        |
| 20204 | process_failure     | Error in get me process               |
| 20205 | process_failure     | Error in get module process           |
| 20206 | process_failure     | Error in get lesson process           |
| 20207 | process_failure     | Error in get task process             |
| 20208 | process_failure     | Error in set state process            |
| 20209 | process_failure     | Error in set comment process          |
| 20210 | process_failure     | Error in get certificate process      |
| 20211 | process_failure     | Error in get counselor process        |
