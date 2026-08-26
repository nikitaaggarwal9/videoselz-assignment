import { useEffect, useState } from 'react';
import AnalyticsTable from './components/AnalyticsTable.jsx';
import Pagination from './components/Pagination.jsx';
import {
  createEngagementEvent,
  fetchVideoAnalytics,
} from './services/api.js';

const DEFAULT_PAGE_SIZE = 3;
const EVENT_TYPES = ['view', 'click', 'add_to_cart'];

function App() {
  const [videos, setVideos] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationMessage, setSimulationMessage] = useState('');
  const [simulationError, setSimulationError] = useState('');

  async function loadAnalytics(signal, { background = false } = {}) {
    if (!background) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const data = await fetchVideoAnalytics({
        page,
        limit: pageSize,
        signal,
      });
      setVideos(data.videos);
      setPagination(data.pagination);
      return true;
    } catch (requestError) {
      if (requestError.name !== 'AbortError') {
        setError(requestError.message);
      }
      return false;
    } finally {
      if (!background && !signal?.aborted) {
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    loadAnalytics(controller.signal);

    return () => controller.abort();
  }, [page, pageSize]);

  function handlePageSizeChange(nextPageSize) {
    setPage(1);
    setPageSize(nextPageSize);
  }

  async function handleSimulateTraffic() {
    const video = videos[Math.floor(Math.random() * videos.length)];
    const eventType = EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)];

    setIsSimulating(true);
    setSimulationMessage('');
    setSimulationError('');

    try {
      await createEngagementEvent({ videoId: video.id, eventType });
      const didRefresh = await loadAnalytics(undefined, { background: true });

      if (!didRefresh) {
        setSimulationError(
          'The event was created, but analytics could not be refreshed.',
        );
        return;
      }

      setSimulationMessage(
        `Added a ${eventType.replaceAll('_', ' ')} event to “${video.title}”.`,
      );
    } catch (requestError) {
      setSimulationError(requestError.message);
    } finally {
      setIsSimulating(false);
    }
  }

  return (
    <main>
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Shoppable video</p>
          <h1>Analytics dashboard</h1>
          <p className="intro">
            Monitor how product videos turn viewer attention into shopping
            intent.
          </p>
        </div>

        <button
          className="primary-button"
          type="button"
          onClick={handleSimulateTraffic}
          disabled={isLoading || isSimulating || videos.length === 0}
        >
          {isSimulating ? 'Simulating…' : 'Simulate Traffic'}
        </button>
      </header>

      <div className="feedback-region">
        {simulationMessage && (
          <p className="notice success-notice" role="status" aria-live="polite">
            {simulationMessage}
          </p>
        )}

        {simulationError && (
          <p className="notice error-notice" role="alert">
            {simulationError}
          </p>
        )}
      </div>

      {isLoading && videos.length === 0 && (
        <section className="state-panel" role="status">
          <span className="loading-indicator" aria-hidden="true" />
          <p>Loading analytics…</p>
        </section>
      )}

      {error && (
        <p className="notice error-notice" role="alert">
          Unable to load analytics: {error}
        </p>
      )}

      {!isLoading && !error && videos.length === 0 && (
        <section className="state-panel">
          <h2>No analytics yet</h2>
          <p>Seed the database to start tracking video performance.</p>
        </section>
      )}

      {videos.length > 0 && (
        <section
          className="analytics-card"
          aria-labelledby="analytics-heading"
          aria-busy={isLoading || isSimulating}
        >
          <div className="card-header">
            <div>
              <h2 id="analytics-heading">Video performance</h2>
              <p>
                {pagination?.totalItems ?? videos.length} videos tracked across
                all products
              </p>
            </div>

            {(isLoading || isSimulating) && (
              <span className="refresh-status" role="status">
                Updating…
              </span>
            )}
          </div>

          <AnalyticsTable videos={videos} />
          <Pagination
            pagination={pagination}
            pageSize={pageSize}
            onPrevious={() => setPage((currentPage) => currentPage - 1)}
            onNext={() => setPage((currentPage) => currentPage + 1)}
            onPageSizeChange={handlePageSizeChange}
          />
        </section>
      )}
    </main>
  );
}

export default App;
