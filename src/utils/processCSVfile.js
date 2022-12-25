const processFastaMappingFile = function (file, name) {
  const arrayOfFastaEntries = splitMultiFasta(file, name);
  return arrayOfFastaEntries
};


function splitMultiFasta(target, name) {
  const fastaArray = target.split(">");
  const reads = []
  let ref = {}
  const regexGaps = /^-*/
  const dnaSeq = /[ATCG]{18,32}/
  const dtsetPattern = /\d[A-Z]_\d/
  const virusPattern = /SMoV|StrV1|SCV/
  const variantPattern = /(RNA\d)?[ABC](?=.fasta)/
  const dataset = name.match(dtsetPattern)[0]
  const virus = name.match(virusPattern)[0]
  const variant = name.match(variantPattern)[0]
  const uniqueSet = new Set

  fastaArray.forEach((fasta, i) => {
    if (!fasta) return

    
    const tmpSplit = fasta.split('\n')
    const tmpFirstLine = tmpSplit[0];
    const tmpSecondLine = tmpSplit[1];
    const tmpSeq = i === 1 ? tmpSecondLine : tmpSecondLine.match(dnaSeq)[0];
    const gapsBeforeSeq = tmpSecondLine.match(regexGaps)[0];

    if(i === 1) {
      const zeroesArray = Array.from({length:tmpSeq.length}).fill(0)
      ref = {
        seqName: tmpFirstLine,
        seq: tmpSeq,
        seqLength: tmpSeq.length,
        coverage: {
          countRev: 0,
          countFrw: 0,
          total: {
            minus: zeroesArray.slice(),
            plus: zeroesArray.slice(),
            position: zeroesArray.map((_ , i) => 1 + i)
          },
          unique: {
            minus: zeroesArray.slice(),
            plus: zeroesArray.slice(),
            position: zeroesArray.map((_ , i) => 1 + i)
          }
        },
    } 
    return
  }

    const unit = {
      seqName: tmpFirstLine,
      unique: uniqueSet.has(tmpSeq) ? false : !!uniqueSet.add(tmpSeq),
      seq: tmpSeq,
      seqLength: tmpSeq.length,
      start: gapsBeforeSeq?.length || 0,
      end: gapsBeforeSeq?.length || 0 ? tmpSeq.length : tmpSeq.length + gapsBeforeSeq?.length,
      reverse: tmpFirstLine.endsWith('reversed)'),
    }
    const readLength = Array.from({length: unit.seqLength}).fill(0).map((_ , i) => 1 + i + unit.start)

    if(unit.reverse) {
      if (unit.unique === true) {
        readLength.map(pos => {
          ref.coverage.total.minus[pos]--
          ref.coverage.unique.minus[pos]--
        })
        } else { 
          readLength.map(pos => ref.coverage.total.minus[pos]-- ) 
        } 
    } else { 
      if (unit.unique === true) {
        readLength.map(pos => {
          ref.coverage.total.plus[pos]++
          ref.coverage.unique.plus[pos]++
        })
      } else {
        readLength.map(pos =>  ref.coverage.total.plus[pos]++ )
      }
    }

    reads.push(unit)

  }
  )


  const countReverseReads = reads.filter(read => read.reverse).length
  // const frRvRatio = countReverseReads
  const frRvRatio = ((reads.length - countReverseReads) / countReverseReads).toFixed(1)

  const uniques = new Set(reads.flatMap( ({seq}) => seq))
  const uniqueReads = [...uniques]
  const uniquesCount = uniques.size
  const totalCount = reads.length
  const nonRedundantPerc = (100 * uniquesCount / totalCount).toFixed(1);




// file name is attached to the dataset in IndexView in function 'showFiles'
  return {dataset, virus,variant, ref, reads, uniqueReads, frRvRatio, totalCount, nonRedundantPerc}

}

export default processFastaMappingFile;
