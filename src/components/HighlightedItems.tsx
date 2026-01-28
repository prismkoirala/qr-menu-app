// src/components/HighlightedItems.tsx
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  fetchHighlightedItems,
  selectHighlightedItems,
  selectHighlightedLoading,
  selectHighlightedError,
} from '../features/restaurantSlice';

interface HighlightedItemsProps {
  open: boolean;
  onClose: () => void;
  restaurantId: number;
}

const HighlightedItems: React.FC<HighlightedItemsProps> = ({
  open,
  onClose,
  restaurantId,
}) => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectHighlightedItems);
  const loading = useAppSelector(selectHighlightedLoading);
  const error = useAppSelector(selectHighlightedError);

  useEffect(() => {
    if (open && restaurantId > 0) {
      dispatch(fetchHighlightedItems(restaurantId));
    }
  }, [open, restaurantId, dispatch]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-orange-50 to-amber-50">
          <h2 className="text-2xl font-bold text-gray-900">Today's Special</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100 transition"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50/70 px-4 py-5">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-orange-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">
              <p>{error}</p>
              <button
                onClick={() => dispatch(fetchHighlightedItems(restaurantId))}
                className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Try Again
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <h3 className="text-xl font-medium mb-2">No specials today</h3>
              <p className="text-sm">Check back later or explore the full menu!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="
                    bg-white border border-gray-200 rounded-xl 
                    px-4 py-3.5 shadow-sm hover:shadow-md 
                    transition-all duration-200
                  "
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: name + description */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-base leading-tight">
                        {item.name}
                      </h3>
                      {item.description && (
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Right: price */}
                    <div className="flex-shrink-0 text-right">
                      <span className="text-lg font-bold text-green-700">
                        Rs. {item.price}
                      </span>
                    </div>
                  </div>

                  {/* Optional image – small thumbnail at bottom if exists */}
                  {/* {item.image && (
                    <div className="mt-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-28 object-cover rounded-lg"
                        loading="lazy"
                      />
                    </div>
                  )} */}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-200 flex justify-end bg-white">
          <button
            onClick={onClose}
            className="px-7 py-2.5 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-900 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HighlightedItems;