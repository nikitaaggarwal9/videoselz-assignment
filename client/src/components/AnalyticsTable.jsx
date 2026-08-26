function formatConversionRate(addToCarts, views) {
  if (views === 0) {
    return '0.00%';
  }

  return `${((addToCarts / views) * 100).toFixed(2)}%`;
}

function AnalyticsTable({ videos }) {
  return (
    <div
      className="table-region"
      role="region"
      aria-label="Video performance metrics"
      tabIndex="0"
    >
      <table>
        <caption className="visually-hidden">Video performance metrics</caption>
        <thead>
          <tr>
            <th scope="col">Video</th>
            <th scope="col">Product</th>
            <th scope="col" className="numeric">
              Views
            </th>
            <th scope="col" className="numeric">
              Clicks
            </th>
            <th scope="col" className="numeric">
              Add-to-cart
            </th>
            <th scope="col" className="numeric">
              Conversion rate
            </th>
          </tr>
        </thead>
        <tbody>
          {videos.map((video) => (
            <tr key={video.id}>
              <th scope="row">{video.title}</th>
              <td>{video.productName}</td>
              <td className="numeric">{video.views}</td>
              <td className="numeric">{video.clicks}</td>
              <td className="numeric">{video.addToCarts}</td>
              <td className="numeric conversion-rate">
                {formatConversionRate(video.addToCarts, video.views)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AnalyticsTable;
