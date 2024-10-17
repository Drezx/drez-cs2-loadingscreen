import React, { useState } from 'react'
import './style/font.css'
import './style/App.css'
import './style/section.css'
import './style/data.css'
import './style/footer.css'

const loadProgressText = {
    "INIT_CORE": "Initializing...",
    "INIT_BEFORE_MAP_LOADED": "Loading map...",
    "INIT_AFTER_MAP_LOADED": "Map loaded...",
    "INIT_SESSION": "Initializing session...",
}
function App() {
    const [logs, setLogs] = useState([]);
    const [progress, setProgress] = useState({
        fraction: 0,
        text: "Initializing...",
    });


    const logMessage = (message) => {
        setLogs((prevLogs) => [message, ...prevLogs]);
    };

    const handleLoading = (e) => {
        const item = e.data
        switch (item.eventName) {
            case "loadProgress":
                setProgress(prevProgress => ({
                    ...prevProgress,
                    fraction: item.loadFraction * 100, 
                }));
                break;
        
            case "startInitFunction":
                logMessage("Start Init Function");
                break;

            case "initFunctionInvoked":
                logMessage(`${item?.type}: ${item?.name}`);
                break;

            case "onLogLine":
                logMessage(`${item?.message}`);

                setProgress(prevProgress => ({
                    ...prevProgress,
                    text: "Loading resources...", 
                }));
                break;

            case "onDataFileEntry":
                logMessage(`Streaming: ${item?.name}`);

                setProgress(prevProgress => ({
                    ...prevProgress,
                    text: "Loading assets...", 
                }));
                break;

            default:
                break;
        }

        if (item.type && loadProgressText[item.type])
            setProgress(prevProgress => ({
                ...prevProgress,
                text: loadProgressText[item.type],
            }));
    }



    React.useEffect(() => {
        window.addEventListener('message', handleLoading)
        return () => {
            window.removeEventListener('message', handleLoading)
        };
    }, []);

    return (
        <>
            <div className='container'>
                <div className='background'></div>

                <section className='right-page'>
                    <h1>Loading...</h1>
                    <hr />

                    <main className='loading-data'>
                        {logs.map((log, index) => (
                            <p key={index} className={'log'}>
                                {log}
                            </p>
                        ))}
                    </main>
                    <footer className='status-bar'>
                        <h2>{`${progress.text}`}</h2>
                        <div className='progress-bar'>
                            <div className="progress" style={{width: `${progress.fraction}%`}}></div>
                        </div>
                    </footer>
                </section>

            </div>

        </>
    )
}

export default App
