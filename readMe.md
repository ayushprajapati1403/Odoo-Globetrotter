Certainly! Here's your polished, well-formatted README.md content with the additional features section integrated smoothly for maximum clarity and impact:

---

# 🌍 GlobeTrotter – Personalized & Intelligent Travel Planning Platform

## 🚀 Overview

GlobeTrotter is a personalized, intelligent, and collaborative travel planning platform designed to make trip organization as exciting as the journey itself. From multi-city itineraries to budget breakdowns, GlobeTrotter empowers travelers to dream, design, and share unforgettable adventures — all in one place.

Built for the Hackathon, GlobeTrotter focuses on creating a user-centric, responsive, and intuitive application that simplifies complex travel planning into a smooth, enjoyable experience.

---

## 🎯 Problem Statement

Planning a trip often becomes overwhelming due to:

* Juggling multiple destinations and dates.
* Tracking activities, bookings, and budgets.
* Lack of collaborative and shareable travel plans.
* Difficulty visualizing an entire trip flow.

*GlobeTrotter addresses these pain points with:*

* Customized multi-city itineraries with activities and budgets.
* Cost breakdowns & visual calendars for better decision-making.
* City & activity discovery tools to inspire new adventures.
* Public sharing features to inspire and collaborate with others.

---

## 🛠 Tech Stack

* *Frontend:* React.js + Tailwind CSS (responsive, dynamic UI)
* *Backend:* Express.js, TypeScript, PostgreSQL (API endpoints, trip data management)
* *Database:* Supabase (PostgreSQL-based, real-time sync)
* *Extra:* REST APIs for city & activity data, chart libraries for budgets

---

## 👥 User Roles & Permissions

| Role      | Permissions                                                                                    |
| --------- | ---------------------------------------------------------------------------------------------- |
| *Guest* | Explore public itineraries, browse cities & activities                                         |
| *User*  | Create/edit trips, build itineraries, manage budget, share plans                               |
| *Admin* | Monitor analytics, manage users, track platform trends, download audit logs in CSV/PDF formats |

---

## 🌟 Core Features

* *Authentication (Login / Signup)*
  Secure email-password login, password recovery, and new account creation with validation.

* *Dashboard / Home*
  Quick access to recent trips, explore popular cities and budget highlights, and instant trip creation.

* *Create Trip*
  Set trip name, dates, description, optional cover photo upload, and start planning immediately.

* *My Trips*
  View, edit, delete, or duplicate upcoming and past trips.

* *Itinerary Builder*
  Add stops with cities and dates, assign activities per city, and drag-and-drop to reorder destinations.

* *Itinerary View*
  Day-wise layout with city headers, activity cards with cost & time info, switchable between list & calendar views.

* *City Search*
  Find destinations by country, cost index, or popularity; add directly to your trip.

* *Activity Search*
  Filter by type, cost, and duration; preview descriptions and images; add activities to specific days.

* *Trip Budget & Cost Breakdown*
  Visual pie/bar charts for expenses, alerts for overbudget days, and average cost per day calculation.

* *Trip Calendar / Timeline*
  Drag-to-reorder activities, expandable day views, and easy trip flow visualization.

* *Shared/Public Itineraries*
  Shareable public URLs, “Copy Trip” button for inspiration-based planning, and social media sharing integration.

* *User Profile / Settings*
  Update profile info & preferences, manage privacy and saved destinations.

* *Admin Dashboard (Optional)*
  Analytics on popular destinations & trips, user activity stats, and user management tools.

---

## 🗂 Database Structure

* *Users:* Accounts, preferences, saved destinations.
* *Trips:* Name, description, cover photo, start & end dates.
* *Stops:* Cities in each trip with dates.
* *Activities:* Name, category, cost, duration, linked to stops.
* *Budgets:* Expense data by category.

---

## 📥 Offline Support & Export Features

* *Itinerary Download as PDF:*
  Users can download their full trip itinerary as a PDF file for offline access and easy sharing—ensuring travel plans are always accessible without internet.

* *Admin Export of Logs:*
  Admin users can export detailed audit logs and platform usage reports as CSV or PDF files, enabling effective monitoring and compliance tracking.

---

## 🔔 Additional Features

* *Real-Time Collaboration:*
  Multiple users can co-edit trip itineraries simultaneously with instant syncing, leveraging Supabase's real-time capabilities.

* *Multi-Currency Support:*
  Plan trips in any currency with automatic conversion using up-to-date exchange rates.

* *Audit Trail:*
  All user actions and trip modifications are logged to ensure accountability and easy rollback.

* *Export Options:*
  Users can export itineraries in PDF or CSV formats for offline access and sharing.

* *Personalized Recommendations:*
  The platform suggests activities and cities based on user preferences and past travel history.

* *Notifications & Reminders:*
  Automated alerts notify users about upcoming bookings, budget limits, and trip milestones.

* *Role-Based Access Control:*
  Fine-grained permission levels allow secure collaboration and data privacy.

---

## 🏆 Hackathon Development Phases

*Phase 1 – Problem Understanding & Assignment (April 11)*
Identified travel planning pain points and assigned feature development roles.

*Phase 2 – Core Development (April 11)*
Built frontend (React + TailwindCSS), backend with Express.js, TypeScript, and PostgreSQL.

*Phase 3 – Integration & Testing (April 12)*
Merged frontend, backend, database, and AI components; completed final bug fixes and UI refinements.

---

## 👥 Team Members

* Ayush Prajapati — Supabase, edge functions, backend
* Prisha Dave — Frontend
* Tamanna Farkiwala — Database, Supabase

---


🔔 Additional Features

- *Real-Time Collaboration:* Multiple users can co-edit trip itineraries simultaneously with instant syncing, leveraging Supabase's real-time capabilities.
- *Multi-Currency Support:* Plan trips in any currency with automatic conversion using up-to-date exchange rates.
- *Audit Trail:* All user actions and trip modifications are logged to ensure accountability and easy rollback.
- *Export Options:* Users can export itineraries in PDF or CSV formats for offline access and sharing.
- *Personalized Recommendations:* The platform suggests activities and cities based on user preferences and past travel history.
- *Notifications & Reminders:* Automated alerts notify users about upcoming bookings, budget limits, and trip milestones.
- *Role-Based Access Control:* Fine-grained permission levels allow secure collaboration and data privacy.

## 📌 Vision

GlobeTrotter is more than just a travel planner — it’s a global travel companion. By combining personalization, collaboration, and intelligent features, we aim to redefine how people dream, design, and share their adventures.

---


ER diagram: https://drive.google.com/drive/folders/1-pzlL6KpYzJZh5CmZHgJsAzr60-zBsqZ?usp=sharing

video demonstration: https://drive.google.com/drive/folders/1-pzlL6KpYzJZh5CmZHgJsAzr60-zBsqZ?usp=sharing
