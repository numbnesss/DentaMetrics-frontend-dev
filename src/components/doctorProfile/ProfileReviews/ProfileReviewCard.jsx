import { useState } from 'react';
import ToneBadge from '../../reviewPage/ui/ToneBadge/ToneBadge';
import SourceBadge from '../../reviewPage/ui/SourceBadge/SourceBadge';
import StarRating from '../../reviewPage/ui/StarRating/StarRating';
import { avatarStyle, avatarColor } from '../../../data/clinic';
import styles from './ProfileReviewCard.module.css';

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('ru-RU');
}

function getTone(rate) {
  return rate >= 4 ? 'positive' : 'negative';
}

export default function ProfileReviewCard({ review, source }) {
  const [replyOpen, setReplyOpen] = useState(false);
  const tone = getTone(review.rate);
  const initials = (review.author_name || '?').trim().slice(0, 2).toUpperCase();

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.avatar} style={avatarStyle(avatarColor(review.author_name))}>
          {initials}
        </div>
        <div className={styles.meta}>
          <div className={styles.nameRow}>
            <span className={styles.name}>{review.author_name || 'Аноним'}</span>
            <StarRating value={review.rate} size={12} />
          </div>
          <div className={styles.subRow}>
            <SourceBadge source={source?.name || 'Источник'} color={source?.color_hex} />
            <span className={styles.date}>{formatDate(review.review_date)}</span>
          </div>
        </div>
      </div>

      <p className={styles.text}>{review.review_text}</p>

      <div className={styles.footer}>
        <ToneBadge tone={tone} />

        {review.has_response && (
          <button type="button" className={styles.replyToggle} onClick={() => setReplyOpen((v) => !v)}>
            <i className="ti ti-corner-down-right" />
            Ответ есть
          </button>
        )}

        {review.review_link && (
          <a
            className={styles.link}
            href={review.review_link}
            target="_blank"
            rel="noopener noreferrer"
          >
            Перейти к отзыву
            <i className="ti ti-external-link" />
          </a>
        )}
      </div>

      {replyOpen && review.response_text && (
        <p className={styles.replyText}>{review.response_text}</p>
      )}
    </div>
  );
}
