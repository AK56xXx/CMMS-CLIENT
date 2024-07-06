# React Native Client Application
# Computerized Maintenance Management System (CMMS)

CMMS is a system that offer the customers a wide collections of functionalities to help them keep an eye on their devices by reviewing statistics, scheduling maintenance sessions or reporting issues.

Core functionalities:
* Maintenance scheduling
* Issues reporting
* Customer Feedback

## Actors Identification
The system has two actors:
* Administrator
* Client

# Specification of Functional Requirements

The main features of our system are:

### Client

- **Manage account**: The client can manage their account by editing profile information, updating their profile picture, or changing their account password.
- **Manage maintenance**: The client can add or reject a maintenance request. Maintenance refers to a scheduled date for a repair session of a specific device.
- **Manage ticket**: The client can create, edit, or cancel an open ticket. Tickets are used to report a problem with a specific device.
- **Manage feedback**: The client can add feedback to an already closed maintenance session.
- **Receive notification**: The client receives notifications for their end-of-service (EOS) devices.
- **Review device information**: The client can check their device information and statistics.
- **View announcements**: The client can view announcements posted by the company.

### Admin

The admin have total control over the system

## Specification of Non-Functional Requirements
### Security

The application must be secure and immune to malicious actions by reducing vulnerability risks. Our application offers:

- Encryption
- JWT + Authentication
- Authorization levels

Powered by Spring Security.

### Maintainability

As the system evolves, it should be easy to maintain and update its communication capabilities. This includes modular design, clear documentation, and well-defined interfaces to facilitate future changes and enhancements.

### Portability
By using React Native for our client side application this allow us to run our codebase written in JavaScript to target multi platforms like Android, IOS, Web and perform as a native like level application and behave the same across all.
