use rocket::{serde::json::Json, State};
use rusqlite::{Connection, params};
use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use rocket::response::status::NotFound;

// Estructura para representar un cliente
#[derive(Debug, Serialize, Deserialize)]
struct Customer {
    customer_id: String,
    company_name: String,
    contact_name: Option<String>,
    contact_title: Option<String>,
    address: Option<String>,
    city: Option<String>,
    region: Option<String>,
    postal_code: Option<String>,
    country: Option<String>,
    phone: Option<String>,
    fax: Option<String>,
}

struct AppState {
    db: Mutex<Connection>,
}

#[rocket::get("/customers?<page>&<per_page>&<name_filter>&<order_by>&<order_direction>")]
async fn get_customers(
    state: &State<AppState>,
    page: Option<u32>,
    per_page: Option<u32>,
    name_filter: Option<String>,
    order_by: Option<String>,
    order_direction: Option<String>
) -> Json<Vec<Customer>> {
    let conn = state.db.lock().unwrap_or_else(|e| e.into_inner()    );
    
    let page = page.unwrap_or(1);
    let per_page = per_page.unwrap_or(10);
    let offset = (page - 1) * per_page;
    
    let mut query = String::from(
        "SELECT CustomerID, 
                CompanyName, 
                ContactName, 
                ContactTitle, 
                Address, 
                City, 
                Region, 
                PostalCode, 
                Country, 
                Phone, 
                Fax 
         FROM Customers"
    );
    
    let mut params_values: Vec<&dyn rusqlite::ToSql> = vec![];
   
    let pattern = name_filter.as_ref()
        .map(|name| format!("%{}%", name))
        .unwrap_or_default();
    
    if name_filter.is_some() {
        query.push_str(" WHERE CompanyName LIKE ?");
        params_values.push(&pattern);
    }
    
    
    let order_by = order_by.unwrap_or_else(|| String::from("CompanyName"));
    let order_direction = order_direction.unwrap_or_else(|| String::from("ASC"));
    query.push_str(&format!(" ORDER BY {} {}", order_by, order_direction));
    
    query.push_str(&format!(" LIMIT {} OFFSET {}", per_page, offset));
    
    let mut stmt = conn.prepare(&query).unwrap();
    println!("{}", query);
    
    let customer_iter = stmt.query_map(params_values.as_slice(), |row| {
        Ok(Customer {
            customer_id: row.get(0)?,
            company_name: row.get(1).unwrap_or("nulo".to_string()),
            contact_name: row.get(2)?,
            contact_title: row.get(3)?,
            address: row.get(4)?,
            city: row.get(5)?,
            region: row.get(6)?,
            postal_code: row.get(7)?,
            country: row.get(8)?,
            phone: row.get(9)?,
            fax: row.get(10)?,
        })
    }).unwrap();

    let customers: Vec<Customer> = customer_iter.map(|c| c.unwrap()).collect();
    Json(customers)
}

#[rocket::get("/customers/<id>")]
async fn get_customer(state: &State<AppState>, id: String) -> Result<Json<Customer>, NotFound<String>> {
    let conn = state.db.lock().unwrap_or_else(|e| e.into_inner());
    let mut stmt = conn.prepare("SELECT * FROM Customers WHERE CustomerID = ?").unwrap();
    let mut rows = stmt.query_map(params![id], |row| {
        Ok(Customer {
            customer_id: row.get(0)?,
            company_name: row.get(1)?,
            contact_name: row.get(2)?,
            contact_title: row.get(3)?,
            address: row.get(4)?,
            city: row.get(5)?,
            region: row.get(6)?,
            postal_code: row.get(7)?,
            country: row.get(8)?,
            phone: row.get(9)?,
            fax: row.get(10)?,
        })
    }).unwrap();
    let customer = match rows.next() {
        Some(c) => c,
        None => return Err(NotFound("".to_string()))
    };
    Ok(Json(customer.unwrap()))
}

#[rocket::post("/customers", format = "json", data = "<customer>")]
async fn create_customer(state: &State<AppState>, customer: Json<Customer>) -> Json<Customer> {
    let conn = state.db.lock().unwrap_or_else(|e| e.into_inner());
    conn.execute(
        "INSERT INTO Customers (CustomerID, CompanyName, ContactName, ContactTitle, 
            Address, City, Region, PostalCode, Country, Phone, Fax)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)",
        params![
            customer.customer_id,
            customer.company_name,
            customer.contact_name,
            customer.contact_title,
            customer.address,
            customer.city,
            customer.region,
            customer.postal_code,
            customer.country,
            customer.phone,
            customer.fax,
        ],
    ).unwrap();
    customer
}

#[rocket::put("/customers/<id>", format = "json", data = "<customer>")]
async fn update_customer(state: &State<AppState>, id: String, customer: Json<Customer>) -> Json<Customer> {
    let conn = state.db.lock().unwrap_or_else(|e| e.into_inner());
    conn.execute(
        "UPDATE Customers 
         SET CompanyName = ?1, ContactName = ?2, ContactTitle = ?3,
             Address = ?4, City = ?5, Region = ?6, PostalCode = ?7,
             Country = ?8, Phone = ?9, Fax = ?10
         WHERE CustomerID = ?11",
        params![
            customer.company_name,
            customer.contact_name,
            customer.contact_title,
            customer.address,
            customer.city,
            customer.region,
            customer.postal_code,
            customer.country,
            customer.phone,
            customer.fax,
            id,
        ],
    ).unwrap();

    customer
}

#[rocket::delete("/customers/<id>")]
async fn delete_customer(state: &State<AppState>, id: String) -> Json<usize> {
    let conn = state.db.lock().unwrap_or_else(|e| e.into_inner()    );
    
    let result = conn.execute(
        "DELETE FROM Customers WHERE CustomerID = ?1",
        params![id],
    ).unwrap();

    Json(result)
}

#[rocket::main]
async fn main() -> Result<(), rocket::Error> {
    let db = Connection::open("northwind.db").unwrap();
    let app_state = AppState {
        db: Mutex::new(db),
    };

    let _rocket = rocket::build()
        .mount("/", rocket::routes![
            get_customers,
            create_customer,
            update_customer,
            delete_customer,
            get_customer
        ])
        .manage(app_state)
        .configure(rocket::Config::figment().merge(("port", 8001)))
        .launch()
        .await?;

    Ok(())
}
