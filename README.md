# 🏥 Clinic Management System

## <a name="introduction">🎉 Introduction</a>

The **Clinic Management System** is a web-based application designed to streamline the operations of a medical clinic. It facilitates efficient management of patients, doctors, appointments, and medical records, ensuring a seamless experience for both staff and patients.

> 🛠️ **Note:** This project was developed during my military service period without any internet access. I contributed specifically to the **front-end development** using Bootstrap.

## <a name="tech-stack">⚙️ Tech Stack</a>\

- **Frontend:**
  - EJS (Embedded JavaScript Templates)
  - HTML/CSS
  - JavaScript
  - Bootstrap

- **Backend:**
  - Node.js
  - Express.js
  - LiteSQL

- **Environment Management:**
  - dotenv

## <a name="features">🔋 Features</a>

👉 **Admin Login:**
- Single admin login using credentials defined in the `.env` file.
- No password creation or password hashing – admin username and password are hardcoded for simplicity.

👉 **Patient Management:**
- Add new patient records with personal and medical details.
- Edit or delete existing patient information.
- Search and filter patient records.

👉 **Appointment Scheduling:**
- Schedule appointments between patients and doctors.
- View, edit, or cancel existing appointments.
- Prevent double-booking with real-time availability checks.

👉 **Medical Records:**
- Maintain detailed medical histories for patients.
- Upload and manage diagnostic reports and prescriptions.

👉 **Dashboard Overview:**
- Visual representation of clinic statistics.
- Quick access to recent activities and alerts.

## <a name="prerequisites">🔧 Prerequisites</a>

Ensure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

## <a name="installation">🚀 Installation</a>

1. **Clone the repository:**
    ```bash
    git clone https://github.com/YousifMHelal/ClinicManagementSystem.git
    ```

2. **Navigate to the project directory:**
    ```bash
    cd ClinicManagementSystem
    ```

3. **Install dependencies:**
    ```bash
    npm install
    ```

4. **Configure environment variables:**

    Create a `.env` file in the root directory and add the following:

    ```env
    PORT=5000
    DATABASE_URL=your_litesql_database_path
    ADMIN_USERNAME=your_admin_username
    ADMIN_PASSWORD=your_admin_password
    ```

5. **Start the application:**
    ```bash
    npm start
    ```

6. **Access the application:**

    Open your browser and navigate to `http://localhost:5000`

## <a name="usage">📘 Usage</a>

- **Admin Dashboard:**
  - Log in using the admin credentials stored in the `.env` file.
  - Navigate through the dashboard to manage patients, doctors, and appointments.

- **Patient Registration:**
  - Add new patients via the "Add Patient" section.
  - View and manage existing patient records.

- **Doctor Management:**
  - Register new doctors and assign specializations.
  - Update doctor availability and profiles.

- **Appointment Scheduling:**
  - Schedule new appointments by selecting a patient and an available doctor.
  - View upcoming appointments and manage schedules.

- **Medical Records:**
  - Upload diagnostic reports and prescriptions to patient profiles.
  - Maintain a comprehensive medical history for each patient.

---

## <a name="note">📌 Important Note</a>

This project was created under unique circumstances—during my military service—with **no internet access** or external help. I independently worked on the **frontend** side of the system using **Bootstrap**, and it was a valuable hands-on experience in self-reliance, problem-solving, and UI development.
