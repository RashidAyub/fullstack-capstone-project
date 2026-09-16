import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { urlConfig } from '../../config';

function SearchPage() {
    // Task 1: Define state variables for the search query, age range, and search results.
    const [searchQuery, setSearchQuery] = useState('');
    const [ageRange, setAgeRange] = useState(6);
    const [searchResults, setSearchResults] = useState([]);

    const categories = ['Living', 'Bedroom', 'Bathroom', 'Kitchen', 'Office'];
    const conditions = ['New', 'Like New', 'Older'];

    useEffect(() => {
        // fetch all products
        const fetchProducts = async () => {
            try {
                let url = `${urlConfig.backendUrl}/api/gifts`;
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`HTTP error; ${response.status}`);
                }

                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.log('Fetch error: ' + error.message);
            }
        };

        fetchProducts();
    }, []);

    // Task 2. Fetch search results from the API based on user inputs.
    const handleSearch = async () => {
        const baseUrl = `${urlConfig.backendUrl}/api/search?`;

        const queryParams = new URLSearchParams({
            name: searchQuery,
            age_years: ageRange,
            category: document.getElementById('categorySelect').value,
            condition: document.getElementById('conditionSelect').value,
        }).toString();

        try {
            const response = await fetch(`${baseUrl}${queryParams}`);

            if (!response.ok) {
                throw new Error('Search failed');
            }

            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Failed to fetch search results:', error);
        }
    };

    const navigate = useNavigate();

    const goToDetailsPage = (productId) => {
        // Task 6. Enable navigation to the details page of a selected gift.
        navigate(`/app/product/${productId}`);
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="filter-section mb-4 p-4 border rounded shadow-sm bg-white">
                        <h5 className="mb-3">Filters</h5>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                {/* Task 3: Dynamically generate category and condition dropdown options. */}
                                <label htmlFor="categorySelect" className="font-weight-bold">Category</label>
                                <select id="categorySelect" className="form-control">
                                    <option value="">All Categories</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="conditionSelect" className="font-weight-bold">Condition</label>
                                <select id="conditionSelect" className="form-control">
                                    <option value="">All Conditions</option>
                                    {conditions.map(condition => (
                                        <option key={condition} value={condition}>
                                            {condition}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Task 4: Implement an age range slider and display the selected value. */}
                        <div className="form-group mb-3">
                            <label htmlFor="ageRange" className="font-weight-bold">
                                Maximum Age: Less than {ageRange} years
                            </label>
                            <input
                                type="range"
                                className="form-control-range w-100"
                                id="ageRange"
                                min="1"
                                max="10"
                                value={ageRange}
                                onChange={e => setAgeRange(e.target.value)}
                            />
                        </div>

                        {/* Task 7: Add text input field for search criteria */}
                        <div className="input-group mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search gifts by name..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                            <div className="input-group-append">
                                {/* Task 8: Implement search button with onClick event to trigger search */}
                                <button
                                    className="btn btn-primary"
                                    onClick={handleSearch}
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Task 5: Display search results and handle empty results with a message. */}
                    <div className="search-results">
                        {searchResults.length > 0 ? (
                            <div className="row">
                                {searchResults.map(product => (
                                    <div key={product.id} className="col-md-6 mb-4">
                                        <div className="card h-100 shadow-sm">
                                            {product.image && (
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="card-img-top"
                                                    style={{ height: '200px', objectFit: 'cover' }}
                                                />
                                            )}
                                            <div className="card-body">
                                                <h5 className="card-title font-weight-bold">{product.name}</h5>
                                                <p className="card-text text-muted small">
                                                    {product.description ? (product.description.slice(0, 90) + '...') : ''}
                                                </p>
                                                <span className="badge badge-info mr-2">{product.category}</span>
                                                <span className="badge badge-secondary">{product.condition}</span>
                                            </div>
                                            <div className="card-footer bg-transparent border-0 pt-0">
                                                <button
                                                    onClick={() => goToDetailsPage(product.id)}
                                                    className="btn btn-outline-primary btn-block"
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="alert alert-info text-center" role="alert">
                                No products found matching your criteria.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchPage;
