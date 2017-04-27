(define member?
	(lambda (a lat)
		(cond
			((null? lat) #f)
			((eq? (car lat) a) #t)
			(#t (member? a (cdr lat)))
		)
	)
)

(member? 3 (1 2 3))
