(define rember
  (lambda (a lat)
    (cond
        ((null? lat) ())
        ((eq? (car lat) a) (cdr lat))
        (else (cons (car lat) (rember a (cdr lat)))

		))))

					(rember '5 '(4 6 8 10 12))
