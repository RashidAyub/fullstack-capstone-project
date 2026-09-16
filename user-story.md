# User Stories - GiftLink Project

## User Story Template

**Title:** [Brief descriptive title of user need]

- **As a** [type of user / persona]
- **I need** [a specific capability or feature]
- **So that** [the business value or user benefit]

### Acceptance Criteria
- [Given / When / Then criteria for done]

---

## Project User Stories

### Story 1: Browse Available Gifts
- **As a** visitor or registered user
- **I need** to view a catalog of all currently available donated gift items on the main page
- **So that** I can see what community gifts are available and choose items I might need.

#### Acceptance Criteria
- Main page displays cards for all gifts loaded from the database (`/api/gifts`).
- Each card shows item title, image, category, condition, posted date, and brief description.
- Clicking a card navigates to the item details page.

---

### Story 2: View Gift Item Details
- **As a** user
- **I need** to click on any gift to view its full details
- **So that** I can assess the item's condition, age, location zipcode, and full description before requesting it.

#### Acceptance Criteria
- Accessing `/app/gifts/:id` loads details for the matching gift via `GET /api/gifts/:id`.
- If an invalid ID is provided, the API returns a 404 status code with an appropriate error message.
- Full details including age in years, condition, and full description are clearly presented.

---

### Story 3: Filter and Search Gifts by Category and Attributes
- **As a** user looking for a specific item
- **I need** to search gifts by keyword and filter by category, condition, and maximum age
- **So that** I can quickly locate items that match my exact needs.

#### Acceptance Criteria
- The `/api/search` endpoint supports query parameters: `name`, `category`, `condition`, and `age_years`.
- Submitting a search query returns only items matching all specified criteria.
- Case-insensitive partial matching is supported for item names.

---

### Story 4: User Registration
- **As a** new community member
- **I need** to register for an account using my name, email address, and password
- **So that** I can log in, post items, and claim available gifts.

#### Acceptance Criteria
- Registration page collects first name, last name, email, and password.
- Submitting the form sends a `POST` request to `/api/auth/register` with `Content-Type: application/json`.
- The backend encrypts passwords securely using bcrypt and prevents duplicate email registrations.
- Successful registration returns a JWT authentication token and user profile details.

---

### Story 5: User Authentication and Login
- **As a** registered user
- **I need** to log into my account using my registered email and password
- **So that** I can access authenticated features securely across sessions.

#### Acceptance Criteria
- Login form sends credentials to `POST /api/auth/login`.
- Upon successful authentication, a JWT bearer token is returned and stored securely in client storage and context.
- Subsequent authenticated requests include the `Authorization` header with the bearer token.
- Invalid credentials yield an appropriate 401/400 error message.

---

### Story 6: Update User Profile
- **As an** authenticated user
- **I need** to update my profile information such as my name and preferences
- **So that** my account information remains current and accurate.

#### Acceptance Criteria
- Authenticated `PUT` request to `/api/auth/update` validates the JWT token in the `Authorization` header.
- User record in the database is updated with the new details.
- Returns the updated user profile in the JSON response.

---

### Story 7: Sentiment Analysis on Gift Comments
- **As a** platform moderator and user
- **I need** sentiment analysis on user comments and gift descriptions
- **So that** positive and community-friendly interactions are encouraged and flagged if negative.

#### Acceptance Criteria
- Sentiment microservice exposes `POST /sentiment` utilizing Natural's `SentimentAnalyzer`.
- Calculates sentiment score based on tokenized English stems and AFINN lexicon.
- Returns JSON containing `sentimentScore` and category (`positive`, `neutral`, `negative`).

---

### Story 8: Automated CI/CD Pipeline
- **As a** developer and DevOps engineer
- **I need** an automated CI/CD pipeline triggered on code pushes
- **So that** tests, lint checks, and builds run automatically to ensure application stability and continuous delivery.

#### Acceptance Criteria
- GitHub Actions workflow triggers on pushes and pull requests to `main`.
- Checks out code, sets up Node.js, installs dependencies, and runs automated tests/builds.
- Reports status checks directly to the GitHub repository.
