import Link from 'next/link';
export default function Home() {
  return (
    <div>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold mb-6">Northwind Database</h1>
        
        <div className="prose">
          <p className="mb-4">
            The Northwind database is a sample database created by Microsoft, commonly used for tutorials, examples and learning purposes. It represents a fictional trading company called &quot;Northwind Traders&quot; and includes data about:
          </p>

          <ul className="list-disc pl-6 mb-4">
            <li>Customers and their orders</li>
            <li>Products and their categories</li>
            <li>Suppliers and inventory</li>
            <li>Employees and territories</li>
            <li>Shipping information</li>
          </ul>

          <p className="mb-4">
            This application provides an interface to manage customer information and orders from the Northwind database, allowing you to:
          </p>

          <ul className="list-disc pl-6">
            <li><Link href="/customers">View and search customers</Link></li>
            <li><Link href="/customers/add">Add new customers</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
