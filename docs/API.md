# API Specification

This document details every Next.js App Router API route in **EduFlow**, specifying HTTP methods, URL paths, authorization rules, request payloads, and response structures.

---

## Authentication & Authorization Model

All protected endpoints authenticate requests by inspecting the Supabase session cookie on the incoming request via `createServerClient`.

- **Public**: Anyone, including unauthenticated visitors.
- **Student**: Any authenticated user with an active session.
- **Instructor**: An authenticated user with the `INSTRUCTOR` or `ADMIN` role who owns the course.
- **Admin**: An authenticated user with the `ADMIN` role.

---

## 1. Courses Endpoints

### `GET /api/courses`
Lists published courses for discovery and search.
- **Access**: Public
- **Query Parameters**:
  - `title` *(optional, string)*: Filter by title substring.
  - `categoryId` *(optional, string)*: Filter by category ID.
- **Response `200 OK`**:
  ```json
  [
    {
      "id": "clx123abc456",
      "title": "Full-Stack Next.js Masterclass",
      "description": "Learn modern full-stack web development.",
      "imageUrl": "https://xyz.supabase.co/storage/v1/object/public/course-thumbnails/img1.jpg",
      "price": 49.99,
      "isPublished": true,
      "category": {
        "id": "cat_1",
        "name": "Web Development"
      },
      "chaptersCount": 12
    }
  ]
  ```

---

### `POST /api/courses`
Creates a new course draft.
- **Access**: Instructor / Admin
- **Request Body**:
  ```json
  {
    "title": "Building Modern SaaS with Next.js"
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "id": "clx123abc456",
    "userId": "auth-uuid-123",
    "title": "Building Modern SaaS with Next.js",
    "isPublished": false,
    "createdAt": "2026-10-29T12:00:00.000Z"
  }
  ```
- **Response `401 Unauthorized` / `403 Forbidden`**:
  ```json
  {
    "error": "You must be an instructor or administrator to create courses."
  }
  ```

---

### `PATCH /api/courses/[courseId]`
Updates course metadata (title, description, price, thumbnail image, or category).
- **Access**: Course Owner (Instructor) / Admin
- **Request Body**:
  ```json
  {
    "title": "Updated Course Title",
    "description": "Comprehensive course description.",
    "imageUrl": "https://xyz.supabase.co/storage/v1/object/public/course-thumbnails/cover.png",
    "price": 29.99,
    "categoryId": "cat_1"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "id": "clx123abc456",
    "title": "Updated Course Title",
    "description": "Comprehensive course description.",
    "imageUrl": "https://xyz.supabase.co/storage/v1/object/public/course-thumbnails/cover.png",
    "price": 29.99,
    "categoryId": "cat_1",
    "updatedAt": "2026-10-29T12:05:00.000Z"
  }
  ```

---

### `DELETE /api/courses/[courseId]`
Deletes a course and cascades deletion to chapters, attachments, and progress records.
- **Access**: Course Owner (Instructor) / Admin
- **Response `200 OK`**:
  ```json
  {
    "message": "Course deleted successfully."
  }
  ```

---

### `PATCH /api/courses/[courseId]/publish`
Publishes a course to make it visible in the public catalog. (Requires at least one published chapter).
- **Access**: Course Owner (Instructor) / Admin
- **Request Body**: None
- **Response `200 OK`**:
  ```json
  {
    "id": "clx123abc456",
    "isPublished": true
  }
  ```
- **Response `400 Bad Request`**:
  ```json
  {
    "error": "Course must contain at least one published chapter before publishing."
  }
  ```

---

### `PATCH /api/courses/[courseId]/unpublish`
Unpublishes a course, hiding it from discovery while preserving existing enrollments.
- **Access**: Course Owner (Instructor) / Admin
- **Request Body**: None
- **Response `200 OK`**:
  ```json
  {
    "id": "clx123abc456",
    "isPublished": false
  }
  ```

---

## 2. Chapters Endpoints

### `POST /api/courses/[courseId]/chapters`
Adds a new chapter to the syllabus.
- **Access**: Course Owner (Instructor) / Admin
- **Request Body**:
  ```json
  {
    "title": "Introduction & Setup"
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "id": "chap_999",
    "courseId": "clx123abc456",
    "title": "Introduction & Setup",
    "position": 1,
    "isPublished": false,
    "isFree": false
  }
  ```

---

### `PUT /api/courses/[courseId]/chapters/reorder`
Updates the sort order of chapters following drag-and-drop actions.
- **Access**: Course Owner (Instructor) / Admin
- **Request Body**:
  ```json
  {
    "list": [
      { "id": "chap_1", "position": 1 },
      { "id": "chap_2", "position": 2 },
      { "id": "chap_3", "position": 3 }
    ]
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "message": "Chapters reordered successfully."
  }
  ```

---

### `PATCH /api/courses/[courseId]/chapters/[chapterId]`
Updates chapter details, video URL, or preview accessibility.
- **Access**: Course Owner (Instructor) / Admin
- **Request Body**:
  ```json
  {
    "title": "Deep Dive into Server Components",
    "description": "Understanding React Server Component boundaries.",
    "videoUrl": "https://xyz.supabase.co/storage/v1/object/public/course-attachments/lesson1.mp4",
    "isFree": true
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "id": "chap_1",
    "title": "Deep Dive into Server Components",
    "videoUrl": "https://xyz.supabase.co/storage/v1/object/public/course-attachments/lesson1.mp4",
    "isFree": true,
    "updatedAt": "2026-10-29T12:10:00.000Z"
  }
  ```

---

### `DELETE /api/courses/[courseId]/chapters/[chapterId]`
Deletes a chapter from a course.
- **Access**: Course Owner (Instructor) / Admin
- **Response `200 OK`**:
  ```json
  {
    "message": "Chapter deleted successfully."
  }
  ```

---

### `PUT /api/courses/[courseId]/chapters/[chapterId]/progress`
Marks a chapter as completed or uncompleted for the currently logged-in student.
- **Access**: Student (must be enrolled or viewing a free chapter)
- **Request Body**:
  ```json
  {
    "isCompleted": true
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "id": "prog_123",
    "userId": "auth-uuid-123",
    "chapterId": "chap_1",
    "isCompleted": true,
    "updatedAt": "2026-10-29T12:15:00.000Z"
  }
  ```

---

## 3. Enrollment Endpoints

### `POST /api/courses/[courseId]/enroll`
Enrolls the authenticated student in a course.
- **Access**: Student
- **Request Body**: None
- **Response `201 Created`**:
  ```json
  {
    "id": "enr_123",
    "userId": "auth-uuid-123",
    "courseId": "clx123abc456",
    "createdAt": "2026-10-29T12:20:00.000Z"
  }
  ```
- **Response `409 Conflict`**:
  ```json
  {
    "error": "You are already enrolled in this course."
  }
  ```

---

## 4. Attachments Endpoints

### `POST /api/courses/[courseId]/attachments`
Attaches a downloadable file reference (stored in Supabase Storage) to a course.
- **Access**: Course Owner (Instructor) / Admin
- **Request Body**:
  ```json
  {
    "name": "Course-Cheat-Sheet.pdf",
    "url": "https://xyz.supabase.co/storage/v1/object/public/course-attachments/Course-Cheat-Sheet.pdf"
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "id": "att_123",
    "name": "Course-Cheat-Sheet.pdf",
    "url": "https://xyz.supabase.co/storage/v1/object/public/course-attachments/Course-Cheat-Sheet.pdf",
    "courseId": "clx123abc456"
  }
  ```

---

### `DELETE /api/courses/[courseId]/attachments/[attachmentId]`
Removes an attachment record.
- **Access**: Course Owner (Instructor) / Admin
- **Response `200 OK`**:
  ```json
  {
    "message": "Attachment removed successfully."
  }
  ```

---

## 5. Administration Endpoints

### `GET /api/admin/categories`
Lists all course categories.
- **Access**: Public / Authenticated
- **Response `200 OK`**:
  ```json
  [
    {
      "id": "cat_1",
      "name": "Web Development",
      "description": "Frontend, backend, and full-stack engineering."
    }
  ]
  ```

---

### `POST /api/admin/categories`
Creates a new course category.
- **Access**: Admin only
- **Request Body**:
  ```json
  {
    "name": "Artificial Intelligence",
    "description": "Machine learning, prompt engineering, and LLMs."
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "id": "cat_2",
    "name": "Artificial Intelligence",
    "description": "Machine learning, prompt engineering, and LLMs."
  }
  ```

---

### `PATCH /api/admin/users/[userId]`
Promotes or modifies a user's platform role.
- **Access**: Admin only
- **Request Body**:
  ```json
  {
    "role": "INSTRUCTOR"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "id": "auth-uuid-456",
    "email": "user@example.com",
    "role": "INSTRUCTOR"
  }
  ```
- **Response `400 Bad Request`**:
  ```json
  {
    "error": "Invalid role value. Must be STUDENT, INSTRUCTOR, or ADMIN."
  }
  ```

