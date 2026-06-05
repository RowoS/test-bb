## Barbados
*Food Ordering Platform built for residents of Baybay City*

| Internal Release Code | Date Released |
| ---------------- | ---------- |
| BS.010.001 | 2026-02-27 |
| BS.010.002 | 2026-03-19 |
| BS.010.003 | 2026-03-19 |
| BS.010.004 | 2026-04-18 |
| BS.010.005 | 2026-04-20 |
| BS.010.006 | 2026-04-28 |
| BS.010.007 | 2026-05-05 |
| BS.010.008 | 2026-05-23 |
| BS.010.009 | 2026-05-28 |
| BS.010.010 | 2026-06-05 |

## BS.010.010 Release Notes
  **Refactors and UI Updates**
  * Updated vendor dashboard to include analytics
  * Updated page layout and color scheme for customer and vendor pages
  * Modified routing in certain pages
  * Replaced placeholder logo with project logo

## BS.010.009 Release Notes
  **Admin Features and Reporting**
  * Created an admin role for store monitoring with respective dashboard
  * Added reporting features for customers to report certain behavior from vendors
  
  **Other Updates**
  * Fixed and updated middleware routing for customers and vendors
  * Removed unused components 

## BS.010.008 Release Notes
  **Chat System**
  * Implemented a chat system feature for customers to contact vendors
  * Added chatlist to customer homepage
  
  **Notifications** 
  * Implemented notifications for customers and vendors; notify users with regards to order status

## BS.010.007 Release Notes
 **Review and Ratings**
 * Added Review Modal for completed orders to leave reviews on stores
 * Added Reviews Page for the vendor-side
 * Modify Store Card to display the store's rating
 * Added Store Review Section when viewing stores

## BS.010.006 Release Notes
  **Order Page - Customer Side**
  * Added functionality for viewing orders made
  * Implemented cancellation and completion functionality for orders 
  * Added "Order History" for viewing completed or cancelled orders
  
  **Order Page - Vendor Side**
  * Enable vendors to see all incoming orders placed by customers
  * Allow vendors to decline or process placed orders
  * Implemented "Order History" for the vendor-side
  * Allow for viewing Delivery Location and Providing Directions 
  
  ***Other Updates***
  * Added Checkout Modal for checking out orders (currently only accepts Cash on Delivery)
  * Deleting items or Updating Item Quantities now available in the Cart Tab
  * Updated functions and types for the checkout modal

## BS.010.005 Release Notes

  **Store Page - Customer View**
  * Added store page view for customers to browse products from stores
  * Added "Cart" component, allowing customers to add products from the store to a cart
  
  **Customer Homepage**
  * Added the "Store Search" functionality to the homepage
  * Added a "Store Catalog" component to homepage for displaying results of store search
  * Added a "Cart View" to homepage to allow customers to view products added from a store
  * Added "Map View" for viewing store locations
  * Implemented and added Navbar component to the homepage
  
  ***Other Updates***
  * Updated store setup to include choices for delivery method
  * Allow vendors to update business hours and mode of delivery

## BS.010.004 Release Notes

  **Store Search Functionality**
  * Added the search function for customers to search for vendor stores
  
  **Catalog Page for Vendors**
  * Added catalog page wherein vendors can add products to their store
  * Implemented edit functionality for products
  
  ***Other Updates***
  * Updated routing logic and imports
  * Updated map overlay to work for Profile changes
  * Added two-factor authentication (2FA) to Login Form

## BS.010.003 Release Notes

* refactor: Update Middleware
* feat: Server-Side rendering for Store Set-up Page and Dashboard
* feat: Add initial dashboard page for vendors
* feat: Add Initial Set-up Page for Store Creation
* feat: Add new UI components for vendor components

## BS.010.002 Release Notes
* feat: Add Location Marking feature on Leaflet Map and Packages
* feat: Implement Leaflet Map
* revert: remove changes from components and updates
* refactor: Folder restructuring 


## BS.010.001 Release Notes

* refactor: Update Middleware
* feat: Add Email Verified Modal
* refactor: Update Middleware and Forms for Role-based Authentication
* refactor: Update UI for Authentication Forms and Landing Page
* feat: Add Functionality to Reset & Update Password Form
* feat: Add Google Auth and redirects
* feat: Add Update Password Form for Password Reset
* feat: Add Sign Up Hook and Update Login Functionality
* fix: Login Page UI and imports
* feat: Add Supabase Client
* feat:Add Login and Sign Up Forms
* feat: Add UI for Landing Page
* Create Initial Next JS Project
* Initial commit

Important Links
* Design Specs: [Barbados Docportal](https://github.com/RowoS/Barbados-docportal)