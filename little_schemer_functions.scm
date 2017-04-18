(define lat?
  (lambda(l)
    (cond
      ((null? l)#t)
      ((atom? (car l))(lat? (cdr l)))
      (else #f))))

(define rember
  (lambda ( a lat)
    (cond
        ((null? lat) (quote ()))
        ((eq? (car lat) a) (cdr lat))
        (else (cons (car lat)
                       (rember a (cdr lat)))))))

(define firsts
  (lambda(l)
    (cond
      ((null? l)(quote()))
      (else (cons (car (car l))
             (firsts (crd l)))))))

(define fact (lambda (x) (if (= x 1) 1 (* x (fact (- x 1))))))

(define member?
  (lambda (a lat)
    (cond
      ((null? lat)#f)
      (else (or (eq? (car lat) a)
                (member? a (cdr lat)))))))
