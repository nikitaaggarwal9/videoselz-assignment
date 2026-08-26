const PAGE_SIZE_OPTIONS = [3, 5, 10, 25];

function Pagination({
  pagination,
  pageSize,
  onPrevious,
  onNext,
  onPageSizeChange,
}) {
  return (
    <nav className="pagination" aria-label="Analytics pagination">
      <label className="page-size-control">
        <span>Rows per page</span>
        <select
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
        >
          {PAGE_SIZE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <div className="page-navigation">
        <button
          className="secondary-button"
          type="button"
          onClick={onPrevious}
          disabled={!pagination.hasPreviousPage}
        >
          Previous
        </button>

        <span className="page-status" aria-live="polite">
          Page {pagination.page} of {pagination.totalPages}
        </span>

        <button
          className="secondary-button"
          type="button"
          onClick={onNext}
          disabled={!pagination.hasNextPage}
        >
          Next
        </button>
      </div>
    </nav>
  );
}

export default Pagination;
