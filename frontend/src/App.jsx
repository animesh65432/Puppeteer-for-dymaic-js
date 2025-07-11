import { useState } from 'react'

function App() {
  const [userInput, setUserInput] = useState({
    name: "",
    mail: "",
    location: ""
  })

  const onSubmit = async (e) => {
    e.preventDefault()
    console.log(userInput)

    try {

      const response = await fetch("https://puppeteer-for-dymaic-js-1miw.vercel.app/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInput),
      })

      if (response.ok) {
        // Create blob from response
        const blob = await response.blob()

        // Create download link
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `user-${userInput.name.replace(/\s+/g, '-')}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        alert('PDF generated and downloaded successfully!')
      } else {
        alert('Error generating PDF')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error generating PDF')
    }
  }

  const containerStyle = {
    maxWidth: '400px',
    margin: '2rem auto',
    padding: '1.5rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif'
  }

  const titleStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    textAlign: 'center',
    color: '#333'
  }

  const formGroupStyle = {
    marginBottom: '1rem'
  }

  const labelStyle = {
    display: 'block',
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#555',
    marginBottom: '0.5rem'
  }

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s'
  }

  const inputFocusStyle = {
    borderColor: '#007bff',
    boxShadow: '0 0 0 2px rgba(0, 123, 255, 0.25)'
  }

  const buttonStyle = {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    marginTop: '1rem'
  }

  const debugStyle = {
    marginTop: '1.5rem',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    border: '1px solid #e9ecef'
  }

  const debugTitleStyle = {
    fontWeight: '600',
    color: '#333',
    marginBottom: '0.5rem'
  }

  const preStyle = {
    fontSize: '0.85rem',
    color: '#666',
    margin: 0,
    whiteSpace: 'pre-wrap'
  }

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>User Information</h2>

      <div>
        <div style={formGroupStyle}>
          <label htmlFor='name' style={labelStyle}>
            Username
          </label>
          <input
            type='text'
            id='name'
            value={userInput.name}
            onChange={(e) => setUserInput((prev) => ({ ...prev, name: e.target.value }))}
            style={inputStyle}
            placeholder="Enter your username"
            onFocus={(e) => e.target.style.borderColor = '#007bff'}
            onBlur={(e) => e.target.style.borderColor = '#ddd'}
          />
        </div>

        <div style={formGroupStyle}>
          <label htmlFor='mail' style={labelStyle}>
            Email
          </label>
          <input
            type='email'
            id='mail'
            value={userInput.mail}
            onChange={(e) => setUserInput((prev) => ({ ...prev, mail: e.target.value }))}
            style={inputStyle}
            placeholder="Enter your email"
            onFocus={(e) => e.target.style.borderColor = '#007bff'}
            onBlur={(e) => e.target.style.borderColor = '#ddd'}
          />
        </div>

        <div style={formGroupStyle}>
          <label htmlFor='location' style={labelStyle}>
            Location
          </label>
          <input
            type='text'
            id='location'
            value={userInput.location}
            onChange={(e) => setUserInput((prev) => ({ ...prev, location: e.target.value }))}
            style={inputStyle}
            placeholder="Enter your location"
            onFocus={(e) => e.target.style.borderColor = '#007bff'}
            onBlur={(e) => e.target.style.borderColor = '#ddd'}
          />
        </div>

        <button
          onClick={onSubmit}
          style={buttonStyle}
          onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
        >
          Submit
        </button>
      </div>

      {/* Display current values for debugging */}
      <div style={debugStyle}>
        <h3 style={debugTitleStyle}>Current Values:</h3>
        <pre style={preStyle}>
          {JSON.stringify(userInput, null, 2)}
        </pre>
      </div>
    </div>
  )
}

export default App