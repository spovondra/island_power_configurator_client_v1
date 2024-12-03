import './Modal.css';

/**
 * Modal component module
 *
 * @module Modal
 */

/**
 * Renders a modal dialog box.
 *
 * @component
 * @memberof module:Modal
 * @param {object} props - Props passed to the Modal component
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {function} props.onClose - Function to call when the modal is closed
 * @param {string} [props.title] - Optional title for the modal
 * @param {React.ReactNode} props.children - Content to display inside the modal
 * @returns {JSX.Element|null} The rendered modal component or `null` if not open
 */
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    {title && <h2 className="modal-title">{title}</h2>}
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
