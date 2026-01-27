#include <iostream>
using namespace std;

int main() {
    long long  N;
    cin >> N;
    long long  factorial =1 ; 
    int i =1 ;
    while(i<=N){
        factorial*=i;
        i++; 
    }
    cout<<factorial;
    return 0;
}
