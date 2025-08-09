import { useState } from 'react';
import { rand_generator_backend } from 'declarations/rand_generator_backend';

function App() {
  const [randomResult, setRandomResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clientTiming, setClientTiming] = useState(null);
  const [performanceHistory, setPerformanceHistory] = useState([]);

  async function generateRandomNumbers() {
    setLoading(true);
    const startTime = performance.now();
    
    try {
      const result = await rand_generator_backend.generate_random_numbers();
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      console.log('Raw result:', result);
      if ('Ok' in result) {
        console.log('Result.Ok:', result.Ok);
        console.log('Numbers array:', result.Ok.numbers);
        console.log('First few numbers:', result.Ok.numbers.slice(0, 10));
        console.log('Type of first number:', typeof result.Ok.numbers[0]);
        console.log('First number value:', result.Ok.numbers[0]);
        console.log('First number as Number:', Number(result.Ok.numbers[0]));
        console.log('First number toString:', result.Ok.numbers[0].toString());
        
        const generationTimeMs = Number(result.Ok.generation_time_ns) / 1000000;
        const cyclesUsed = Number(result.Ok.cycles_used);
        
        // Update performance history
        const newPerformanceEntry = {
          generationTime: generationTimeMs,
          cycles: cyclesUsed,
          timestamp: Date.now()
        };
        
        setPerformanceHistory(prev => [...prev, newPerformanceEntry]);
        
        setRandomResult(result.Ok);
        setClientTiming({
          totalTime: totalTime,
          networkTime: Math.max(0, totalTime - generationTimeMs)
        });
      } else {
        console.error('Error generating random numbers:', result.Err);
        alert('Error: ' + result.Err);
      }
    } catch (error) {
      console.error('Failed to generate random numbers:', error);
      alert('Failed to generate random numbers: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <img src="/logo2.svg" alt="DFINITY logo" />
      <br />
      <br />
      
      <section>
        <h1>IC Random Number Generator</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button 
            onClick={generateRandomNumbers} 
            disabled={loading}
            style={{ 
              padding: '10px 20px', 
              fontSize: '16px', 
              backgroundColor: '#4CAF50', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Generating...' : 'Generate 3000 Random Numbers (0-49999)'}
          </button>
          
          {performanceHistory.length > 0 && (
            <button 
              onClick={() => setPerformanceHistory([])}
              style={{ 
                padding: '8px 16px', 
                fontSize: '14px', 
                backgroundColor: '#f44336', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Clear Statistics
            </button>
          )}
        </div>
        
        {randomResult && (
          <div style={{ marginTop: '20px', textAlign: 'left' }}>
            <h3>Results:</h3>
            <p><strong>Count:</strong> {Number(randomResult.count).toString()}</p>
            <p><strong>Range:</strong> 0 to {(Number(randomResult.range_max) - 1).toString()}</p>
            <p><strong>Seed (first 16 bytes):</strong> {Array.from(randomResult.seed.slice(0, 16)).map(b => b.toString(16).padStart(2, '0')).join(' ')}</p>
            
            <details style={{ marginTop: '10px' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                Show first 50 numbers (click to expand)
              </summary>
              <div style={{ 
                marginTop: '10px', 
                padding: '10px', 
                backgroundColor: '#f5f5f5', 
                borderRadius: '4px',
                fontFamily: 'monospace',
                maxHeight: '200px',
                overflowY: 'auto'
              }}>
                {Array.from(randomResult.numbers.slice(0, 50)).map((num, index) => (
                  <span key={index} style={{ marginRight: '10px' }}>
                    {num}
                  </span>
                ))}
                {randomResult.numbers.length > 50 && <div>... and {randomResult.numbers.length - 50} more numbers</div>}
              </div>
            </details>
            
            <details style={{ marginTop: '10px' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                Number Statistics
              </summary>
              <div style={{ marginTop: '10px' }}>
                {(() => {
                  const numbersArray = Array.from(randomResult.numbers);
                  const min = Math.min(...numbersArray);
                  const max = Math.max(...numbersArray);
                  const average = numbersArray.reduce((sum, n) => sum + n, 0) / numbersArray.length;
                  const rangeMax = Number(randomResult.range_max);
                  const expectedAverage = (rangeMax - 1) / 2; // Expected average for uniform distribution
                  const isAverageNormal = Math.abs(average - expectedAverage) < (expectedAverage * 0.05); // Within 5%
                  
                  return (
                    <>
                      <p><strong>Min:</strong> {min}</p>
                      <p><strong>Max:</strong> {max}</p>
                      <p><strong>Average:</strong> {average.toFixed(2)}</p>
                      <p><strong>Expected Average:</strong> {expectedAverage.toFixed(2)}</p>
                      <p><strong>Distribution Quality:</strong> 
                        <span style={{ 
                          color: isAverageNormal ? 'green' : 'orange',
                          fontWeight: 'bold',
                          marginLeft: '5px'
                        }}>
                          {isAverageNormal ? '✓ Normal' : '⚠ Slightly skewed'}
                        </span>
                      </p>
                      <p><strong>Deviation from Expected:</strong> {Math.abs(average - expectedAverage).toFixed(2)} ({((Math.abs(average - expectedAverage) / expectedAverage) * 100).toFixed(2)}%)</p>
                    </>
                  );
                })()}
              </div>
            </details>

            <details style={{ marginTop: '10px' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                Performance Metrics
              </summary>
              <div style={{ marginTop: '10px' }}>
                {clientTiming && (
                  <>
                    <p><strong>Total Request Time:</strong> {clientTiming.totalTime.toFixed(2)} ms</p>
                    <p><strong>Total Generation Time:</strong> {(Number(randomResult.generation_time_ns) / 1000000).toFixed(2)} ms</p>
                    <p><strong>Network Overhead:</strong> {Math.max(0, clientTiming.networkTime).toFixed(2)} ms</p>
                    <p><strong>Total Cycle Usage:</strong> {Number(randomResult.cycles_used).toLocaleString()}</p>
                    <p><strong>Cycles per Number:</strong> {(Number(randomResult.cycles_used) / Number(randomResult.count)).toFixed(0)}</p>
                  </>
                )}
                
                {!clientTiming && (
                  <p style={{ fontStyle: 'italic', color: '#666' }}>Generate numbers to see performance metrics</p>
                )}
              </div>
            </details>
          </div>
        )}
      </section>


    </main>
  );
}

export default App;
