(define member?
  (lambda (a lat)
    (cond
      ((null? lat)#f)
      (else (or (eq? (car lat) a) (member? a (cdr lat))))

				)))

(member? 4 (1 2 3))
