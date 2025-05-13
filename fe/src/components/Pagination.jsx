import PropTypes from "prop-types";
import colors from "../helper/colors";

export const Pagination = ({ currentPage, onPageChange, totalPages, disableButton }) => {
    console.log("🚀 ~ Pagination ~ currentPage:", currentPage)
    console.log("🚀 ~ Pagination ~ totalPages:", totalPages)
    const renderPageNumbers = () => {
        let pages = [];
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                pages.push(
                    <span
                        key={i}
                        className="mx-2"
                        style={{
                            cursor: "pointer",
                            color: currentPage === i ? colors.primary : "black",
                            fontWeight: currentPage === i ? "bold" : "normal",
                        }}
                        onClick={() => onPageChange(i)}
                    >
                        {i}
                    </span>
                );
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                pages.push(<span key={i}>.....</span>);
            }
        }
        return pages;
    };

    return (
        <div className="d-flex justify-content-center align-items-center my-3">
            <button
                className="d-flex justify-content-center align-items-center"
                style={{
                    marginRight: "10px",
                    width: "25px",
                    height: "25px",
                    borderRadius: "50%",
                    backgroundColor: currentPage === 1 || disableButton ? "#888" : colors.primary,
                    border: "none",
                    color: "white",
                    cursor: currentPage === 1 || disableButton ? "not-allowed" : "pointer",
                }}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1 || disableButton}
            >
                <div style={{ marginBottom: "3px" }}> &#8249;</div>
            </button>
            {renderPageNumbers()}
            <button
                className="d-flex justify-content-center align-items-center"
                style={{
                    marginLeft: "10px",
                    width: "25px",
                    height: "25px",
                    borderRadius: "50%",
                    backgroundColor: (currentPage === totalPages || totalPages == 0 )  || disableButton ? "#888" : colors.primary,
                    border: "none",
                    color: "white",
                    cursor: (currentPage === totalPages || totalPages == 0 ) || disableButton ? "not-allowed" : "pointer",
                }}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={(currentPage === totalPages || totalPages == 0 )  || disableButton}
            >
                <div style={{ marginBottom: "3px" }}> &#8250;</div>
            </button>
        </div>
    );
};

Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    totalPages: PropTypes.number.isRequired,
    disableButton: PropTypes.bool.isRequired,
};