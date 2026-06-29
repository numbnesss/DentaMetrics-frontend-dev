import { useState } from 'react';
import ToneBadge from '../../reviewPage/ui/ToneBadge/ToneBadge';
import SourceBadge from '../../reviewPage/ui/SourceBadge/SourceBadge';
import StarRating from '../../reviewPage/ui/StarRating/StarRating';
import { avatarStyle } from '../../../data/clinic';
import styles from './ReviewCard.module.css';

export default function ReviewCard({ review, isAdmin, onAssign }) {
  const [replyOpen, setReplyOpen] = useState(false);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.avatar} style={avatarStyle(review.avatarColor)}>
          {review.initials}
        </div>
        <div className={styles.meta}>
          <div className={styles.nameRow}>
            <span className={styles.name}>{review.name}</span>
            <StarRating value={review.rating} size={12} />
          </div>
          <div className={styles.subRow}>
            <SourceBadge source={review.source} />
            <span className={styles.date}>{review.date}</span>
          </div>
        </div>
      </div>

      <p className={styles.text}>{review.text}</p>

      <div className={styles.footer}>
        <ToneBadge tone={review.tone} />

        {review.doctorName ? (
          <button
            type="button"
            className={`${styles.assignedBadge} ${isAdmin ? styles.clickable : ''}`}
            onClick={isAdmin ? () => onAssign(review) : undefined}
            title={isAdmin ? 'Изменить привязку' : undefined}
          >
            <i className="ti ti-stethoscope" style={{ fontSize: 12 }} />
            {review.doctorName}
          </button>
        ) : (
          isAdmin && (
            <button type="button" className={styles.assignBtn} onClick={() => onAssign(review)}>
              <i className="ti ti-link" style={{ fontSize: 12 }} />
              Врачу
            </button>
          )
        )}

        <button
          type="button"
          className={`${styles.replyBadge} ${review.hasReply ? styles.hasReply : styles.noReply}`}
          onClick={review.hasReply ? () => setReplyOpen((v) => !v) : undefined}
        >
          <i className={`ti ${review.hasReply ? 'ti-corner-down-right' : 'ti-clock'}`} />
          {review.hasReply ? 'Ответ есть' : 'Без ответа'}
        </button>
      </div>

      {review.hasReply && replyOpen && (
        <div className={styles.replyBlock}>
          <div className={styles.replyLabel}>
            <i className="ti ti-message-2" />
            Ответ клиники
          </div>
          <p className={styles.replyText}>{review.reply}</p>
          <a className={styles.replyLink} href={review.url || '#'} target="_blank" rel="noopener noreferrer">
            Перейти к отзыву
            <i className="ti ti-external-link" />
          </a>
        </div>
      )}
    </div>
  );
}
