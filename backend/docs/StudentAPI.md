# Student API

> Current version: **3.0**

## Types

### User

A basic type, representing the user (for now, only student). In general use object does not contain any sensitive information, on auth sessions (see auth, checkPayment and createPass methods) it provides an additional item _token_.

| Item      | Description                 | Type             | Required |
| --------- | --------------------------- | ---------------- | -------- |
| id        | Unique User ID              | UserID           | true     |
| email     | User email                  | string           | true     |
| firstName | User first name             | string           | true     |
| lastName  | User last name              | string           | true     |
| lang      | User lang                   | _"en"_ \| _"ru"_ | true     |
| modules   | List of active user modules | Array[ModuleID]  | true     |
| token     | Authorization object        | Object           | false    |

### Module

All data about the module. If the user was authorized, data contains information about his/her solving status and inner content, otherwise — only main info.

| Item             | Description                                     | Type                                                    | Required |
| ---------------- | ----------------------------------------------- | ------------------------------------------------------- | -------- |
| id               | Module ID                                       | ModuleID                                                | true     |
| name             | Module name                                     | string                                                  | true     |
| shortName        | Displayed name of the task (in UI)              | string                                                  | true     |
| lang             | module's lang                                   | _"en"_ \| _"ru"_                                        | true     |
| description      | Text description of the module                  | string                                                  | true     |
| features         | Module features                                 | Array[Feature]                                          | true     |
| mascot           | Module avatar                                   | Object{}                                                | true     |
| moduleLink       | Link to the module’s promo page                 | string (URL)                                            | true     |
| price            | Market price of the module                      | Object                                                  | true     |
| buyLink          | Link to external payment form                   | string (URL)                                            | true     |
| prevModule       | Dependency with other modules                   | ModuleId                                                | false    |
| prolongation     | Price for the access prolongation to the module | Object                                                  | false    |
| prolongationLink | Link to external payment form                   | string (URL)                                            | false    |
| intro            | Data for the start page of the module           | Array[Element]                                          | false    |
| final            | Data for the final page of the module           | Object{content: Array[Element], things: Array[Element]} | false    |
| lessons          | List of lessons                                 | Array[Lesson]                                           | false    |
| score            | Total value of the student’s score              | number                                                  | false    |
| maxScore         | Maximum score for whole module                  | number                                                  | false    |
| doneTasks        | Number of the student’s done tasks              | number                                                  | false    |
| totalTasks       | Total number of practice tasks in the module    | number                                                  | false    |
| nextTask         | Data of the next unsolved task                  | Object{}                                                | false    |

### Lesson

Content of specific lesson plus short user summary.

| Item        | Description                                      | Type           | Required |
| ----------- | ------------------------------------------------ | -------------- | -------- |
| id          | Lesson ID                                        | LessonID       | true     |
| title       | Title of the lesson                              | string         | true     |
| description | Text description of the lesson                   | string         | true     |
| maxScore    | Maximum possible score for the current lesson.   | number         | true     |
| intro       | Data for the start page of the lesson            | Array[Element] | false    |
| final       | Data for the final page of the lesson            | Array[Element] | false    |
| tasks       | List of tasks for this lesson                    | Array[Task]    | true     |
| score       | Total value of the lesson’s score                | number         | true     |
| maxScore    | Maximum score for whole lesson                   | number         | true     |
| doneTasks   | Number of the student’s done tasks in the lesson | number         | true     |
| totalTasks  | Total number of practice tasks in the lesson     | number         | true     |

### Task

Whole task information with the user's current status of solving and controls state.

| Item        | Description                                                                     | Type                                     | Required |
| ----------- | ------------------------------------------------------------------------------- | ---------------------------------------- | -------- |
| id          | Unique Task ID                                                                  | FullTaskID                               | true     |
| name        | Displayed name of the task (in the navigation, tab, URL)                        | string                                   | true     |
| type        | Type of the task                                                                | _“theory”_, _“practice”_                 | true     |
| required    | Exist, if task is required                                                      | boolean                                  | true     |
| title       | Heading of the task                                                             | string                                   | true     |
| description | Text description of the task                                                    | string                                   | false    |
| template    | Initial template selector for the task                                          | _“s”_ \| _“m”_ \| _“l”_ \| _“oneColumn”_ | false    |
| maxScore    | Maximum possible score for the current task. Required only for type “practice”. | number                                   | false    |
| hint        | Hint for the task                                                               | string                                   | false    |
| solution    | Our interpretation of the task                                                  | Array[Element]                           | false    |
| content     | Main content of the task                                                        | Array[Content]                           | true     |
| isChecked   | Checked sigh                                                                    | boolean                                  | true     |
| score       | Current student’s score of the task                                             | number                                   | true     |
| inProcess   | Is student try to solve the task                                                | boolean                                  | true     |
| protest     | Is student disagree with teacher                                                | boolean                                  | true     |
| comments    | History of student’s comment for the task                                       | Array[Comment]                           | true     |
| module      | Module ID                                                                       | ModuleID                                 | false    |
| lesson      | Lesson number                                                                   | number                                   | false    |

### Content

The inner main content of any task.

| Item      | Description                               | Type            | Required |
| --------- | ----------------------------------------- | --------------- | -------- |
| id        | Unique Content ID                         | FullContentID   | true     |
| questions | List of question of current content block | Array[Question] | false    |
| intro     | Intro of this content                     | Array[Element]  | false    |
| img       | List of content images                    | Array[Image]    | false    |

### Element

The basic block of any text data in the taskbook. This is the custom implementation, based on HTML tags.

| Item     | Description                                | Type                                                                                                                                 | Required |
| -------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| id       | Unique Element ID                          | FullElementID                                                                                                                        | true     |
| type     | Type of the inner content                  | _“p”_ \| _“h1”_ \| _“h2”_ \| _“h3”_ \| _“h4”_ \| _“ul”_ \| _“ol”_ \| _“span”_ \| _“richText”_ \| _“img“_ \| _“video”_ \| _“diploma”_ | true     |
| value    | Text value                                 | string                                                                                                                               | false    |
| list     | List of data (for ol, ul, richText)        | Array\[ListItem \| RichTextItem]                                                                                                     | false    |
| parentId | ID of the item, which value we want to use | FullElementId \| FullVariantId                                                                                                       | false    |

### ListItem

Child in any list element.

| Item     | Description                                       | Type                           | Required |
| -------- | ------------------------------------------------- | ------------------------------ | -------- |
| id       | Unique Element ID                                 | FullElementID                  | true     |
| type     | Type of the inner content                         | _“li”_ \| _“richText”_         | true     |
| value    | Value of the item (if the item is not a richText) | string                         | false    |
| list     | Items for richText                                | Array[RichTextItem]            | false    |
| parentId | ID of the item, which value we want to use        | FullElementId \| FullVariantId | false    |

### RichTextItem

Items of the rich-formatting element.

| Item     | Description                                | Type                                                                                                         | Required |
| -------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------ | -------- |
| id       | Unique Element ID                          | FullElementID                                                                                                | true     |
| type     | Type of the inner content                  | _“text”_ \| _“bold”_ \| _“italic”_ \| _“underline”_ \| _“strikethrough”_ \| _“link”_ \| _“mono”_ \| _“span”_ | true     |
| value    | string                                     | string                                                                                                       | true     |
| link     | URL address (for type link)                | string (URL)                                                                                                 | false    |
| parentId | ID of the item, which value we want to use | FullElementId \| fullVariantId                                                                               | false    |

### Image

Image element.

| Item       | Description                                                         | Type                | Required |
| ---------- | ------------------------------------------------------------------- | ------------------- | -------- |
| id         | Unique Element ID                                                   | FullElementID       | true     |
| url        | Type of the inner content                                           | string (URL)        | true     |
| caption    | Image description. Uses in alt text and below the image on the page | string              | false    |
| thumbnails | List of alt resolution of the image                                 | Array[string (URL)] | false    |

### Question

In practice tasks, the main content element.

| Item        | Description                                                                          | Type                                                                          | Required |
| ----------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- | -------- |
| id          | Unique Question ID                                                                   | FullQuestionID                                                                | true     |
| type        | Type of the question. Affects at render question                                     | _“text”_ \| _“radio”_ \| _“checkbox”_ \| _“select”_ \| _“choice”_ \| _“link”_ | true     |
| topic       | Title of the question                                                                | string                                                                        | false    |
| subtopic    | Additional explanatory text or depended content                                      | Array\[string \| Element]                                                     | false    |
| multiply    | How many variants can choose the student (for types radio, checkbox, select, choice) | boolean                                                                       | false    |
| maxScore    | Maximum score for question                                                           | number                                                                        | true     |
| variants    | List of variants (for types radio, checkbox, select, choice)                         | Array[Variant]                                                                | false    |
| minLength   | Minimal answer length (for types text and link)                                      | number                                                                        | false    |
| rightAnswer | Right answer to the question                                                         | string \| number                                                              | false    |
| depends     | List of question dependencies                                                        | Array[Depend]                                                                 | false    |
| isVisible   | Visibility state for the question                                                    | boolean                                                                       | true     |

### Variant

When the question is selectable, contains one of the question's variants.

| Item       | Description                                                                     | Type                       | Required |
| ---------- | ------------------------------------------------------------------------------- | -------------------------- | -------- |
| id         | Unique Variant ID                                                               | FullVariantID              | true     |
| label      | Text of the variant (required if the variant hasn’t parentId)                   | string \| Element          | false    |
| isRight    | Selected, if this variant right                                                 | boolean                    | true     |
| isSelected | Value of the choice answer (for question types radio, checkbox, select, choice) | boolean                    | false    |
| value      | Value of the text answer (for question types text and link)                     | string                     | false    |
| price      | Variant price in calculating student’s result                                   | number                     | true     |
| refs       | Indicate, that answer’s right rely on other questions                           | Array[Reference]           | false    |
| parentId   | ID of the item, which value we want to use                                      | FullElementId \| variantId | false    |

### State

The object is representing the current state of the task. Returns after any of the task's parameters is changing.

| Item             | Description                             | Type                                                            | Required |
| ---------------- | --------------------------------------- | --------------------------------------------------------------- | -------- |
| userId           | ID of the student                       | string                                                          | true     |
| taskId           | ID of the task                          | string                                                          | true     |
| data             | Main saved content                      | Object{FullQuestionId: {state: VariantState \| [VariantState]}} | false    |
| isChecked        | Checked sigh                            | boolean                                                         | false    |
| score            | Current student’s score of the task     | number \| null                                                  | false    |
| inProcess        | Is student try to solve the task        | boolean                                                         | false    |
| protest          | Is student disagree with teacher        | boolean                                                         | false    |
| isHintActive     | State of hint visibility                | boolean                                                         | false    |
| isOurVarActive   | State of out variant solving visibility | boolean                                                         | false    |
| isSolutionActive | State of solution visibility            | boolean                                                         | false    |

### VariantState

In the Task state, keep the state of the specific question.

| Item       | Description                                                                     | Type              | Required |
| ---------- | ------------------------------------------------------------------------------- | ----------------- | -------- |
| id         | Unique Variant ID                                                               | string            | true     |
| label      | Text of the variant                                                             | string \| Element | true     |
| isRight    | Selected, if this variant is right                                              | boolean           | true     |
| price      | Variant price in calculating student’s result                                   | number            | true     |
| isSelected | Value of the choice answer (for question types radio, checkbox, select, choice) | boolean           | false    |
| value      | Value of the text answer (for question types text and link)                     | string            | false    |

### Comment

User's comment for a specific task.

| Item          | Description                         | Type               | Required |
| ------------- | ----------------------------------- | ------------------ | -------- |
| ts            | Date & time stamp                   | number (timestamp) | true     |
| message       | Text value of the student’s comment | string             | true     |
| readByTeacher | Status of comment                   | boolean            | false    |

### Feature

One of the items describes the module's features.

| Item  | Description               | Type                      | Required |
| ----- | ------------------------- | ------------------------- | -------- |
| icon  | Used icon                 | string (Consta Icon name) | true     |
| label | Text value of the feature | string                    | true     |

### ParentContent

The object provides to replace some content with any other data.

| Item     | Description                                             | Type                           | Required |
| -------- | ------------------------------------------------------- | ------------------------------ | -------- |
| parentId | ID of the item, which value we want to use              | FullElementId \| FullVariantId | true     |
| altText  | Default text (if the system can’t download target value | string                         | false    |

### Reference

When the question solution chain with previous student answers, this object contains the ids of the referenced answers.

| Item       | Description                      | Type                       | Required |
| ---------- | -------------------------------- | -------------------------- | -------- |
| type       | Connection type of the reference | _“isRight”_ \| _“isWrong”_ | true     |
| variantIds | List of the reference IDs        | Array[variantId]           | false    |

### Depend

In some content, this option allows it to depend on the state of some other content (for now, only "visibility" is supported).

| Item     | Description                                | Type                           | Required |
| -------- | ------------------------------------------ | ------------------------------ | -------- |
| type     | Connection type of the depend              | _“visibility”_                 | true     |
| parentId | ID of the item, which value we want to use | FullElementId \| FullVariantId | true     |

### Certificate

The type provides all information about the user's certificate of a specific module.

| Item       | Description                   | Type             | Required |
| ---------- | ----------------------------- | ---------------- | -------- |
| moduleId   | Unique Module ID              | ModuleID         | true     |
| moduleName | Module name                   | string           | true     |
| firstName  | User first name               | string           | true     |
| lastName   | User last name                | string           | true     |
| start      | Start of education            | string (Date)    | true     |
| deadline   | Last day access to the module | string (Date)    | true     |
| certDate   | Date of certificate           | string (Date)    | true     |
| certId     | Unique Certificate ID         | CertificateID    | true     |
| score      | Current user score            | number           | true     |
| maxScore   | Maximum score of the module   | number           | true     |
| skills     | Pumped skills                 | Array[Skill]     | true     |
| fileId     | File ID (to access the file)  | string           | true     |
| doneTasks  | Number of solver tasks        | number           | true     |
| lang       | Certificate language          | _“en”_ \| _“ru”_ | true     |
| isColor    | Color option                  | boolean          | true     |
| isMascot   | Mascot visibility             | boolean          | true     |
| isProgress | Progress visibility           | boolean          | true     |
| isPublic   | External visibility           | boolean          | true     |

### Skill

In the certificate, the result combines some of the skills. This object contains one of them.

| Item      | Description                | Type         | Required |
| --------- | -------------------------- | ------------ | -------- |
| name      | Skill name                 | string       | true     |
| progress  | Progress for current skill | number       | true     |
| code      | Skill's code               | string       | false    |
| subskills | List of inner subskills    | Array[Skill] | false    |

### Counselor

Data for user's FAQ.

| Item  | Description   | Type        | Required |
| ----- | ------------- | ----------- | -------- |
| lang  | Skill name    | string      | true     |
| pages | List of pages | Array[Page] | true     |

### Page

Content for FAQ's specific page.

| Item    | Description                 | Type           | Required |
| ------- | --------------------------- | -------------- | -------- |
| id      | Unique Counselor Page ID    | PageID         | true     |
| title   | Page title                  | string         | true     |
| content | List of counselor's content | Array[Element] | true     |

## Methods

All methods return a JSON object with a boolean status (OK) and a data object on a successful request (or an Error object on failed one). The Return block for each method showed only data objects.

### auth

<aside>
🌐 *POST*, [api.eduhund.com/v3/student/auth](https://api.eduhund.ru/v3/student/auth)

</aside>

#### Description

Authorise user (student). Return main user info and access token.

#### Parameters

| Parameter | Description   | Type             | Required | Default value |
| --------- | ------------- | ---------------- | -------- | ------------- |
| email     | User login    | string           | true     | —             |
| pass      | User password | string           | true     | —             |
| lang      | User language | _"en"_ \| _"ru"_ | false    | _"en"_        |

#### Return

User's object.

### checkPayment

<aside>
🌐 *GET*, [api.eduhund.com/v3/student/checkPayment](https://api.eduhund.ru/v3/student/checkPayment)

</aside>

#### Description

An alternative way log in to new users. It uses a payment ID, provided by a payment gateway.

#### Parameters

| Parameter | Description       | Type   | Required | Default value |
| --------- | ----------------- | ------ | -------- | ------------- |
| paymentId | Unique payment ID | string | true     | —             |

#### Return

User's object.

### createPass

<aside>
🌐 *POST*, [api.eduhund.com/v3/student/createPass](https://api.eduhund.com/v3/student/createPass)

</aside>

### Description

Set a new password for the user. If successful, authorize the user with new credentials and return the same data, as method auth.

### Parameters

| Parameter | Description                             | Type   | Required | Default value |
| --------- | --------------------------------------- | ------ | -------- | ------------- |
| email     | User login                              | string | true     | —             |
| pass      | New user password                       | string | true     | —             |
| verifyKey | One-time key for resetting the password | string | true     | —             |

#### Return

User's object.

### getCounselor

<aside>
🌐 *GET*, [api.eduhund.com/v3/student/getCounselor](https://api.eduhund.com/v3/student/getCounselor)

</aside>

#### Description

Return taskbook FAQ.

#### Parameters

| Parameter | Description        | Type             | Required | Default value |
| --------- | ------------------ | ---------------- | -------- | ------------- |
| lang      | Counselor language | _"en"_ \| _"ru"_ | true     | —             |

#### Return

Counselor's object.

### getCertificate

<aside>
🌐 *GET*, [api.eduhund.com/v3/student/getCertificate](https://api.eduhund.com/v3/student/getCertificate)

</aside>

#### Description

This method returns the certificate's data. It is also used to request custom design certificates and update certificate settings.

#### Parameters

| Parameter | Description                     | Type     | Required | Default value |
| --------- | ------------------------------- | -------- | -------- | ------------- |
| moduleId  | Unique module ID                | ModuleID | true     | —             |
| isColor   | Color setting for certificate   | boolean  | false    | —             |
| isMacsot  | Visibility of module's mascot   | boolean  | false    | —             |
| isResult  | Visibility of user's progress   | boolean  | false    | —             |
| isPublic  | External certifivate visibility | boolean  | false    | —             |

#### Return

Certificate's object.

### getLesson

<aside>
🌐 *GET*, [api.eduhund.com/v3/student/getLesson](https://api.eduhund.com/v3/student/getLesson)

</aside>

#### Description

This method returns data from the lesson. It includes the student’s deadline and basic student stats.

#### Parameters

| Parameter | Description      | Type         | Required | Default value |
| --------- | ---------------- | ------------ | -------- | ------------- |
| lessonId  | Unique lesson ID | FullLessonID | true     | —             |

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

| Parameter | Description      | Type     | Required | Default value |
| --------- | ---------------- | -------- | -------- | ------------- |
| moduleId  | Unique module ID | ModuleID | true     | —             |

#### Return

Module's object.

### getTask

<aside>
🌐 *GET*, [api.eduhund.com/v3/student/getTask](https://api.eduhund.com/v3/student/getTask)

</aside>

#### Description

This method gets prepared Task data with the current student’s state.

#### Parameters

| Parameter | Description    | Type       | Required | Default value |
| --------- | -------------- | ---------- | -------- | ------------- |
| taskId    | Unique task ID | FullTaskID | true     | —             |

#### Return

Task's object.

### addComment

<aside>
🌐 *POST*, [api.eduhund.com/v3/student/addComment](http://api.eduhund.ru/api/v2/addComment)

</aside>

#### Description

This method saves new comments to the task.

#### Parameters

| Parameter | Description         | Type       | Required | Default value |
| --------- | ------------------- | ---------- | -------- | ------------- |
| taskId    | Task ID for comment | FullTaskID | true     | —             |
| comment   | Comment text        | string     | true     | —             |

#### Return

Updated task's comment list.

### getCommentsList

> Canary

<aside>
🌐 *GET*, [api.eduhund.com/v3/student/getCommentsList](http://api.eduhund.ru/api/v2/getCommentsList)

</aside>

#### Description

This method returns a list of comments for the task.

#### Parameters

| Parameter | Description | Type       | Required | Default value |
| --------- | ----------- | ---------- | -------- | ------------- |
| taskId    | Task ID     | FullTaskID | true     | —             |

#### Return

Updated task's comment list.

### setState

<aside>
🌐 *POST*, [api.eduhund.com/v3/student/setState](https://api.eduhund.com/v3/student/setState)

</aside>

#### Description

This method update (or initiate) the state of the question. When it is the first state, also update the parameter inProcess for the task state.

#### Parameters

| Parameter  | Description          | Type                | Required | Default value |
| ---------- | -------------------- | ------------------- | -------- | ------------- |
| questionId | Unique question ID   | string (questionId) | true     | —             |
| newState   | Changed task's state | State               | true     | —             |

#### Return

### getModulesList

<aside>
🌐 *GET*, [api.eduhund.com/v3/student/getModulesList](https://api.eduhund.com/v3/student/getModulesList)

</aside>

#### Description

This method returns the list of available modules.

#### Parameters

This method doesn't have any parameters.

#### Return

List of module objects.
