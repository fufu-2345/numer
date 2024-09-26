import React, { useState } from 'react';

const MatrixInput = ({ rows, cols, onSubmit }) => {
    const [matrix, setMatrix] = useState(Array(rows).fill().map(() => Array(cols).fill('')));

    const handleChange = (row, col, value) => {
        const newMatrix = matrix.map((r, i) => 
            r.map((c, j) => (i === row && j === col ? value : c))
        );
        setMatrix(newMatrix);
    };

    const handleSubmit = () => {
        onSubmit(matrix);
    };
    

    return (
        <div>
            {matrix.map((row, rowIndex) => (
                <div key={rowIndex} style={{ display: 'flex' }}>
                    {row.map((value, colIndex) => (
                        <input
                            key={colIndex}
                            type="text"
                            value={value}
                            onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
                            style={{ width: '110px', height: '30px', margin: '2px' }}
                        />
                    ))}
                </div>
            ))}
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
};

const App = () => {
    const [matrixData, setMatrixData] = useState([]);

    const handleMatrixSubmit = (data) => {
        setMatrixData(data);
        console.log(data);
    };


    const calculateRowSums = () => {
        return matrixData.map(row => 
            row.reduce((sum, value) => sum + Number(value), 0)
        );
    };

    return (
        <div>
            <h1>Matrix Input</h1>
            <MatrixInput rows={3} cols={3} onSubmit={handleMatrixSubmit} />

            <h2>Submitted Matrix:</h2>
            console.log(matrixData);
            <pre>{JSON.stringify(matrixData, null, 0)}</pre>

            <h2>Row Sums:</h2>
    <pre>{JSON.stringify(calculateRowSums(), null, 2)}</pre>
        </div>
    );
};

export default App;
