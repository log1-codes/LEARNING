#include <iostream>
using namespace std;

int main() {
    long long  N;
    cin >> N;
    long long sum = 0; 
    int i =1 ;
    while(i<=N){
        sum+=i;
        i++; 
    }
    cout<<sum;
    return 0;
}
