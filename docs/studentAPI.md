# Student API
> Current version: **3.0**

## Types

### User

### Module

### Lesson

### Task

### Comment

### State

### Certificate

### Counselor

## Methods
All methods return a JSON object with a boolean status (OK) and a data object on a successful request (or an Error object on failed one). The Return block for each method showed only data objects. 

### auth
<aside>
🌐 *POST*, [api.eduhund.com/v3/student/auth](https://api.eduhund.ru/v3/student/auth)

</aside>

#### Description

Authorise user (student). Return main user info and access token.

#### Parameters

| Parameter | Description | Type | Required | Default value |
| --- | --- | --- | --- | --- |
| email | User login | string | true | — |
| pass | User password | string | true | — |
| lang | User language |*"en"* \| *"ru"* | false | *"en"* |

#### Return
User's object.

### checkPayment
<aside>
🌐 *GET*, [api.eduhund.com/v3/student/checkPayment](https://api.eduhund.ru/v3/student/checkPayment)

</aside>

#### Description

An alternative way log in to new users. It uses a payment ID, provided by a payment gateway.

#### Parameters

| Parameter | Description | Type | Required | Default value |
| --- | --- | --- | --- | --- |
| paymentId | Unique payment ID | string | true | — |

#### Return
User's object.

### createPass
<aside>
🌐 *POST*, [api.eduhund.com/v3/student/createPass](https://api.eduhund.com/v3/student/createPass)

</aside>

### Description

Set a new password for the user. If successful, authorize the user with new credentials and return the same data, as method auth. 

### Parameters

| Parameter | Description | Type | Required | Default value |
| --- | --- | --- | --- | --- |
| email | User login | string | true | — |
| pass | New user password | string | true | — |
| verifyKey | One-time key for resetting the password | string | true | — |

#### Return
User's object.

### getCounselor
<aside>
🌐 *GET*, [api.eduhund.com/v3/student/getCounselor](https://api.eduhund.com/v3/student/getCounselor)

</aside>

#### Description

Return taskbook FAQ.

#### Parameters

| Parameter | Description | Type | Required | Default value |
| --- | --- | --- | --- | --- |
| lang | Counselor language |*"en"* \| *"ru"* | true | — |

#### Return
Counselor's object.

### getCertificate
<aside>
🌐 *GET*, [api.eduhund.com/v3/student/getCertificate](https://api.eduhund.com/v3/student/getCertificate)

</aside>

#### Description

This method returns the certificate's data. It is also used to request custom design certificates and update certificate settings.

#### Parameters

| Parameter | Description | Type | Required | Default value |
| --- | --- | --- | --- | --- |
| moduleId | Unique module ID | ModuleID | true | — |
| isColor | Color setting for certificate | boolean | false | — |
| isMacsot | Visibility of module's mascot | boolean | false | — |
| isResult | Visibility of user's progress | boolean | false | — |
| isPublic | External certifivate visibility | boolean | false | — |

#### Return
Certificate's object.

### getLesson
<aside>
🌐 *GET*, [api.eduhund.com/v3/student/getLesson](https://api.eduhund.com/v3/student/getLesson)

</aside>

#### Description

This method returns data from the lesson. It includes the student’s deadline and basic student stats.

#### Parameters

| Parameter | Description | Type | Required | Default value |
| --- | --- | --- | --- | --- |
| lessonId | Unique lesson ID | FullLessonID | true | — |

#### Return
Lesson's object.

### getMe
<aside>
🌐 *GET*, [api.eduhund.com/v3/student/getMe](https://api.eduhund.com/v3/student/getMe)

</aside>

#### Description

This method returns the user's info.

#### Parameters

This method doesn't have any parameters.

#### Return
User's object.

### getModule
<aside>
🌐 *GET*, [api.eduhund.com/v3/student/getModule](https://api.eduhund.com/v3/student/getModule)

</aside>

#### Description

This method returns all info about the module.

#### Parameters

| Parameter | Description | Type | Required | Default value |
| --- | --- | --- | --- | --- |
| moduleId | Unique module ID | ModuleID | true | — |

#### Return
Module's object.

### getTask
<aside>
🌐 *GET*, [api.eduhund.com/v3/student/getTask](https://api.eduhund.com/v3/student/getTask)

</aside>

#### Description

This method gets prepared Task data with the current student’s state.

#### Parameters

| Parameter | Description | Type | Required | Default value |
| --- | --- | --- | --- | --- |
| taskId | Unique task ID | FullTaskID | true | — |

#### Return

Task's object.

### addComment
<aside>
🌐 *POST*, [api.eduhund.com/v3/student/addComment](http://api.eduhund.ru/api/v2/addComment)

</aside>

#### Description

This method saves new comments to the task.

#### Parameters

| Parameter | Description | Type | Required | Default value |
| --- | --- | --- | --- | --- |
| taskId | Task ID for comment | FullTaskID | true | — |
| comment | Comment text | string | true | — |

#### Return
Updated task's comment list.

### setState
<aside>
🌐 *POST*, [api.eduhund.com/v3/student/setState](https://api.eduhund.com/v3/student/setState)

</aside>

#### Description

This method update (or initiate) the state of the question. When it is the first state, also update the parameter inProcess for the task state.

#### Parameters

| Parameter | Description | Type | Required | Default value |
| --- | --- | --- | --- | --- |
| questionId | Unique question ID | string (questionId) | true | — |
| newState | Changed task's state | State | true | — |

#### Return
